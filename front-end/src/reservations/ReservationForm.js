import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, changeReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export const ReservationForm = ({initialFormState}) => {

  const [reservation, setReservation] = useState({...initialFormState});
  const [newReservationError, setNewReservationError] = useState(null);
  const history = useHistory();
  const {reservationId} = useParams();

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

    if(reservationId) {
      try {
        await changeReservation(reservation, Abort.signal);
      }
      catch (error) {
        setNewReservationError(error);
      }
    } else {
      try {
        console.log(reservation)
        await createReservation(reservation, Abort.signal)
        history.push(`/dashboard?date=${reservation.reservation_date}`)
      }
      catch (error) {
        setNewReservationError(error);
      }
    }
    console.log("Submitted:", reservation);
  };

    return (
        <div className="border p-2 mt-2">
            <ErrorAlert error={newReservationError} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name" className="my-2">First Name</label>
                <br/>
                <input
                    className="px-2 form-control"
                    id="first_name"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={reservation.first_name}
                    required={true}
                >
                
                </input>
                <br/>
                <label htmlFor="last_name" className="my-2">Last Name</label>
                <br/>
                <input
                    className="px-2 form-control"
                    id="last_name"
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={reservation.last_name}
                    required={true}
                />
                <br/>
                <label htmlFor="mobile_number" className="my-2">Mobile Number</label>
                <br/>
                <input
                    className="px-2 form-control"
                    id="mobile_number"
                    type="tel"
                    name="mobile_number"
                    onChange={handleChange}
                    value={reservation.mobile_number}
                    maxLength="12"
                    required={true}
                />
                <br/>
                <label htmlFor="reservation_date" className="my-2">Reservation Date</label>
                <br/>
                <input
                    className="px-2 form-control"
                    id="reservation_date"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    name="reservation_date"
                    onChange={handleChange}
                    value={reservation.reservation_date}
                    maxLength="10"
                    required={true}
                />
                <br/>
                <label htmlFor="reservation_time" className="my-2">Reservation Time</label>
                <br/>
                <input
                    className="px-2 form-control"
                    id="reservation_time"
                    type="time"
                    placeholder="HH:MM"
                    pattern="[0-9]{2}:[0-9]{2}"
                    name="reservation_time"
                    onChange={handleChange}
                    value={reservation.reservation_time}
                    required={true}
                />
                <br/>
                <label htmlFor="people" className="my-2">Number of People</label>
                <br/>
                <input
                    className="px-2 col-2 form-control"
                    id="people"
                    type="number"
                    name="people"
                    onChange={handleChange}
                    value={reservation.people}
                    min={1}
                    required={true}
                />
                <br/>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Submit
                </button>
                <button
                    className="btn btn-secondary ml-2"
                    type="cancel"
                    onClick={() => history.goBack()}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default ReservationForm;