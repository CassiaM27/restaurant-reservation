import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { findReservation, updateReservation } from "../utils/api";
import { hasValidDateTimeAndPhone } from "./ValidateTimeDatePhone";
import ShowAllErrors from "../layout/ShowAllErrors";
import ReservationForm from "./ReservationForm";

export const EditReservation = () => {

  const [reservation, setReservation] = useState({});
  const [reservationErrors, setReservationErrors] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const Abort = new AbortController();
    setReservationErrors(null);
    findReservation(reservation_id, Abort.signal)
      .then(setReservation)
      .catch(setReservationErrors);

    return () => Abort.abort();
  }, [reservation_id]);

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Abort = new AbortController();

    const errors = hasValidDateTimeAndPhone(reservation);
    if (errors.length) {
      return setReservationErrors(errors);
    }

    try {
      await updateReservation(reservation, Abort.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setReservationErrors([error]);
    }

    return () => Abort.abort();
  };

  return (
    <section>
      <h2>Edit Reservation:</h2>
      <ShowAllErrors errors={reservationErrors} />
      <ReservationForm
        formData={reservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </section>
  );
};

export default EditReservation;