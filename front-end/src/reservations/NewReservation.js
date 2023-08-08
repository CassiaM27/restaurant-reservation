import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservation() {

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
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