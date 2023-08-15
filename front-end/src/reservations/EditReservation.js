import React, { useEffect, useState } from "react";
import { readReservation } from "../utils/api";
import { useParams } from 'react-router-dom'
import ReservationForm from "./ReservationForm";

function EditReservation() {

    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});

    useEffect(() => {
      const Abort = new AbortController();

      readReservation(reservation_id, Abort.signal)
        .then(setReservation)

        return () => Abort.abort()

    }, [reservation_id])

    return (
        <div>
            <h1 className="my-3">Edit Reservation</h1>
            <ReservationForm initialFormState={reservation} />
        </div>
    )
}

export default EditReservation;