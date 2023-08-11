import React, { useEffect, useState } from "react";
import { showReservation } from "../utils/api";
import { useParams } from 'react-router-dom'
import ReservationForm from "./ReservationForm";

function EditReservation() {

    const { reservationId } = useParams();
    const [formData, setFormData] = useState({});
  
    useEffect(() => {
      const Abort = new AbortController();
    
      async function loadReservation() {
        try{
          const pullReservation = await showReservation(reservationId, Abort.signal);
          setFormData(pullReservation);
        }
        catch (error) {
          console.log("error loading reservation");
        }
        return () => {
          Abort.abort();
        }
      }
      loadReservation();
    }, [reservationId])

    return (
        <div>
            <h1 className="my-3">Edit Reservation</h1>
            <ReservationForm initialFormState={formData} id={reservationId}/>
        </div>
    )
}

export default EditReservation;