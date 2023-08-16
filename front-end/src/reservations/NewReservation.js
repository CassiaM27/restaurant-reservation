import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { hasValidDateAndTime } from "./ValidateTimeDate";
import ReservationForm from "./ReservationForm";
import ShowAllErrors from "../layout/ShowAllErrors";

function NewReservation() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  }

  const [reservation, setReservation] = useState({});
  const [reservationErrors, setReservationErrors] = useState(null);

  const handleChange = (event) => {
    if (event.target.name === "people") {
      setReservation({
        ...reservation,
        [event.target.name]: Number(event.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [event.target.name]: event.target.value,
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
      await createReservation(reservation, Abort.signal);
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
      <h1 className="my-3">New Reservation</h1>
      <ShowAllErrors errors={reservationErrors} />
      <ReservationForm
        reservation={initialFormState}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default NewReservation;