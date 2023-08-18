import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom'
import { updateReservation, findReservation } from "../utils/api";
import { hasValidDateAndTime } from "./ValidateTimeDate";
import ReservationForm from "./ReservationForm";
import ShowAllErrors from "../layout/ShowAllErrors";

function EditReservation() {

  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [reservationErrors, setReservationErrors] = useState(null);

  const history = useHistory();

  useEffect(loadReservation, []);

  function loadReservation() {
    const Abort = new AbortController();
    findReservation(reservation_id, Abort.signal)
      .then((res) =>
        setReservation({
          ...res,
          reservation_date: new Date(res.reservation_date)
            .toISOString()
            .substr(0, 10),
        })
      )
      .catch(setReservationErrors);
    return () => Abort.abort();
  }

  const handleChange = ({ target }) => {
    if (target.name === "people") {
      setReservation({
        ...reservation,
        [target.name]: Number(target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [target.name]: target.value,
      });
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Abort = new AbortController();

    const errors = hasValidDateAndTime(reservation);
    if(errors.length) {
      return setReservationErrors(errors);
    }

    try {
      await updateReservation(reservation, Abort.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    }
    catch (error) {
      setReservationErrors([error]);
    }
    console.log("Submitted:", reservation);
    return () => Abort.abort();
  };

  return (
    <div>
      <h1 className="my-3">Edit Reservation</h1>
      <ShowAllErrors errors={reservationErrors} />
      <ReservationForm
        formData={reservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default EditReservation;