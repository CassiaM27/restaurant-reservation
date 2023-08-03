import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservation() {

    const initialFormState = {
        firstName: "",
        lastName: "",
        mobileNumber: "",
        reservationDate: "",
        reservationTime: "",
        people: "",
    }

    return (
        <div>
            <h1 className="my-3">New Reservation</h1>
            <ReservationForm initialFormState={initialFormState} />
        </div>
    )
}

export default NewReservation;