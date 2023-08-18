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

  const [formData, setFormData] = useState({...initialFormState});
  const [reservationErrors, setReservationErrors] = useState(null);

  const handleChange = ({ target }) => {
    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Abort = new AbortController();

    let errors = hasValidDateAndTime(formData);
    if(errors.length) {
      return setReservationErrors(errors);
    }

    try {
      await createReservation(formData, Abort.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    catch (error) {
      setReservationErrors([error]);
    }
    console.log("Submitted:", formData);
    return () => Abort.abort();
  };

  return (
    <div>
      <h1 className="my-3">New Reservation</h1>
      <ShowAllErrors errors={reservationErrors} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default NewReservation;