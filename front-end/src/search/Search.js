import React, { useState } from "react";
import { listReservations, updateStatus } from "../utils/api";
import ListReservations from "../reservations/ListReservations";
import ShowAllErrors from "../layout/ShowAllErrors";

export const Search = () => {
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [searchErrors, setSearchErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const filterResults = false;

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  function validPhone(mobileNumber) {
    const phoneNumber = mobileNumber.replace(/\D/g, "")
    if(Number.isNaN(phoneNumber) || phoneNumber === "") {
      return new Error("Mobile number must be a number");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    let error = validPhone(mobileNumber);
    if(error) {
      return setSearchErrors([error])
    }

    try {
      let result = await listReservations(
        { mobile_number: mobileNumber },
        abortController.signal
      );
      await setReservations(result);
      setSubmitted(true);
    }
    catch(error) {
      setSearchErrors([error])
    }

    return () => abortController.abort();
  };

  const handleCancel = async (event) => {
    const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
    if (result) {
      await updateStatus(event.target.value, "cancelled");
    }
  };

  return (
    <section>
      <h2 className="m-3">Search</h2>
      <ShowAllErrors errors={searchErrors} />
        <form onSubmit={handleSubmit} className="form-inline">
          <div className="form-group">
            <div className="form-group mx-2 mb-2">
              <label htmlFor="mobile_number" className="sr-only">Mobile Number:</label>
              <input
                className="border rounded form-control"
                id="mobile_number"
                name="mobile_number"
                type="tel"
                required={true}
                placeholder="Mobile number"
                value={mobileNumber}
                maxLength="12"
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-2">
              Find
            </button>
          </div>
        </form>
      {submitted ? (
        <ListReservations
          reservations={reservations}
          filterResults={filterResults}
          handleCancel={handleCancel}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default Search;