import React, { useState } from "react";
import { listReservations, updateStatus } from "../utils/api";
import ListReservations from "../reservations/ListReservations";

export const Search = () => {
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const filterResults = false;

  const handleChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Abort = new AbortController();

    const result = await listReservations(
      { mobile_number: mobileNumber },
      Abort.signal
    );
    setReservations(result);
    setSubmitted(true);

    return () => Abort.abort();
  };

  const handleCancel = async (event) => {
    const abortController = new AbortController();

    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (result) {
      await updateStatus(event.target.value, "cancelled");
      let res = await listReservations(
        { mobile_number: mobileNumber },
        abortController.signal
      );
      await setReservations(res);
      setSubmitted(true);
    }

    return () => abortController.abort();
  };

  return (
    <section>
      <h2 className="m-3">Search</h2>
      <div>
        <form onSubmit={handleSubmit} className="col">
          <div className="row">
            <label htmlFor="mobile_number" className="col-3 align-center text-right">Mobile Number:</label>
            <input
              className="form-control col-9"
              id="mobile_number"
              name="mobile_number"
              type="text"
              required={true}
              placeholder="Enter a customer's phone number"
              value={mobileNumber}
              maxLength="12"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary ml-1 mt-3 row">
            Find
          </button>
        </form>
      </div>
      {submitted ? (
        <ListReservations
          reservations={reservations}
          filterResults={filterResults}
          cancelHandler={handleCancel}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default Search;