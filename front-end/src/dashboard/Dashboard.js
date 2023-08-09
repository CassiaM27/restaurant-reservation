import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handlePrevious() {

  }

  function handleToday() {
    loadDashboard();
  }

  function handleNext() {

  }

  const allReservations = reservations.map((reservation) => {
    return (
      <div className="m-2 border rounded pt-2 row">
        <div className="col-6">
          <p className="mx-3">Name: {reservation.last_name}, {reservation.first_name}</p>
          <p className="mx-3">Phone Number: {reservation.mobile_number}</p>
        </div>
        <div className="col-6">
          <p className="">Day: {reservation.reservation_date}</p>
          <p className="">Time: {reservation.reservation_time}</p>
          <p className="">People: {reservation.people}</p>
        </div>
      </div>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        <button
          className="btn btn-light border"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="btn btn-light border mx-2"
          onClick={handleToday}
        >
          Today
        </button>
        <button
          className="btn btn-light border"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>{allReservations}</div>
    </main>
  );
}

export default Dashboard;
