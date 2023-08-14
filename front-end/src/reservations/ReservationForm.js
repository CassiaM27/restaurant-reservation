import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, changeReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export const ReservationForm = ({initialFormState}) => {
    
    const [formData, setFormData] = useState({...initialFormState});
    const [newReservationError, setNewReservationError] = useState(null);
    const history = useHistory();
    const {reservationId} = useParams();

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        const Abort = new AbortController();

        if(reservationId) {
            async function editReservation() {
                try{
                    await changeReservation(formData, Abort.signal);
                }
                catch (error) {
                    setNewReservationError(error);
                }
                return () => {
                    Abort.abort();
                }
            }
            editReservation();
        } else {
            async function makeReservation() {
                try{
                    await createReservation(formData, Abort.signal);
                    console.log(createReservation(formData, Abort.signal))
                }
                catch (error) {
                    setNewReservationError(error);
                }
                return () => {
                    Abort.abort();
                }
            }
            makeReservation();
        }
        setFormData(initialFormState);
        console.log("Submitted:", formData);
        history.push("/")
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
                    value={formData.first_name}
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
                    value={formData.last_name}
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
                    value={formData.mobile_number}
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
                    value={formData.reservation_date}
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
                    value={formData.reservation_time}
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
                    value={formData.people}
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