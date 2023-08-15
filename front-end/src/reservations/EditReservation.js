import React, { useEffect, useState } from "react";
import { readReservation } from "../utils/api";
import { useParams } from 'react-router-dom'
import ReservationForm from "./ReservationForm";
import ShowAllErrors from "../layout/ShowAllErrors";

function EditReservation() {

    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});
    const [reservationErrors, setReservationErrors] = useState(null);
    
    useEffect(() => {
      const Abort = new AbortController();

      readReservation(reservation_id, Abort.signal)
        .then(setReservation)
        .catch(setReservationErrors);

        return () => Abort.abort()

    }, [reservation_id])

    return (
        <div>
            <h1 className="my-3">Edit Reservation</h1>
            <ShowAllErrors errors={reservationErrors} />
            <ReservationForm initialFormState={reservation} />
        </div>
    )
}

export default EditReservation;