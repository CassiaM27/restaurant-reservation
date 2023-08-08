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

  console.log(reservations)

  function handlePrevious() {

  }

  function handleToday() {
    loadDashboard();
  }

  function handleNext() {

  }

  const allReservations = reservations.map((reservation) => {
    return (
      <div>
        <p>{reservation.last_name}, {reservation.first_name}</p>
        <p>{reservation.mobile_number}</p>
        <p>{reservation.reservation_date}</p>
        <p>{reservation.reservation_time}</p>
        <p>{reservation.people}</p>
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
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
