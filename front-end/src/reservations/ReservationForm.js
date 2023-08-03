import React, { useState } from "react";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export const ReservationForm = ({initialFormState}) => {
    
    const [formData, setFormData] = useState({...initialFormState});
    const workDays = [];
    //const timeOpen = [];

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        const Abort = new AbortController();

        async function makeReservation() {
            try{
                if(!workDays.includes(formData.reservationDate)) {
                    ErrorAlert();
                } else {
                    await createReservation(formData, Abort.signal);
                }
            }
            catch (error) {
                console.log("error creating reservation");
            }
            return () => {
                Abort.abort();
            }
        }
        makeReservation();
        setFormData(initialFormState);
        console.log("Submitted:", formData);
    };

    return (
        <div className="border p-2 mt-2">
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName" className="my-2">First Name</label>
            <br/>
            <input
                className="px-2 form-control"
                id="firstName"
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.firstName}
                required={true}
            >
            
            </input>
            <br/>
            <label htmlFor="lastName" className="my-2">Last Name</label>
            <br/>
            <input
                className="px-2 form-control"
                id="lastName"
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.lastName}
                required={true}
            />
            <br/>
            <label htmlFor="mobileNumber" className="my-2">Mobile Number</label>
            <br/>
            <input
                className="px-2 form-control"
                id="mobileNumber"
                type="tel"
                name="mobile_number"
                onChange={handleChange}
                value={formData.mobileNumber}
                required={true}
            />
            <br/>
            <label htmlFor="reservationDate" className="my-2">Reservation Date</label>
            <br/>
            <input
                className="px-2 form-control"
                id="reservationDate"
                type="date"
                name="reservation_date"
                onChange={handleChange}
                value={formData.reservationDate}
                required={true}
            />
            <br/>
            <label htmlFor="reservationTime" className="my-2">Reservation Time</label>
            <br/>
            <input
                className="px-2 form-control"
                id="reservationTime"
                type="time"
                name="reservation_time"
                onChange={handleChange}
                value={formData.reservationTime}
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
            <button type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
        </div>
    )
}

export default ReservationForm;