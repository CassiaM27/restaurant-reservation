import React from "react";
import { useHistory } from "react-router-dom";

export const ReservationForm = ({ formData, handleSubmit, handleChange }) => {
  const history = useHistory();

    return (
      <>
      <div className="border p-2 mt-2">
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name" className="my-2">First Name</label>
          <br/>
          <input
            className="px-2 form-control"
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            placeholder="Customer's first name"
            required={true}
            value={formData.first_name}
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
            placeholder="Customer's last name"
            required={true}
            value={formData.last_name}
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
            placeholder="Customer's phone number"
            required={true}
            value={formData.mobile_number}
            maxLength="12"
          />
          <br/>
          <label htmlFor="reservation_date" className="my-2">Reservation Date</label>
          <br/>
          <input
            className="px-2 form-control"
            id="reservation_date"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            required={true}
            value={formData.reservation_date}
            maxLength="10"
          />
          <br/>
          <label htmlFor="reservation_time" className="my-2">Reservation Time</label>
          <br/>
          <input
            className="px-2 form-control"
            id="reservation_time"
            type="time"
            pattern="[0-9]{2}:[0-9]{2}"
            name="reservation_time"
            onChange={handleChange}
            placeholder="HH:MM"
            required={true}
            value={formData.reservation_time}
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
            placeholder="0"
            value={formData.people}
            required={true}
            min={1}
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
            data-reservation-id-cancel={formData.reservation_id}
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
      </div>
      </>
    )
}

export default ReservationForm;