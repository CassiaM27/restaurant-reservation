import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate, formatAsTime, previous, next, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [viewDate, setViewDate] = useState(date)

  useEffect(loadDashboard, [viewDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ viewDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const allReservations = reservations.map((reservation) => {
    return (
      <div className="m-2 border rounded pt-2 row">
        <div className="col-6">
          <p className="mx-3">Name: {reservation.last_name}, {reservation.first_name}</p>
          <p className="mx-3">Phone Number: {reservation.mobile_number}</p>
        </div>
        <div className="col-6">
          <p className="">Day: {formatAsDate(reservation.reservation_date)}</p>
          <p className="">Time: {formatAsTime(reservation.reservation_time)}</p>
          <p className="">People: {reservation.people}</p>
        </div>
      </div>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {viewDate}</h4>
      </div>
      <div>
        <button
          className="btn btn-light border ml-2"
          onClick={() => setViewDate(previous(date))}
        >
          Previous
        </button>
        <button
          className="btn btn-light border mx-2"
          onClick={() => setViewDate(today())}
        >
          Today
        </button>
        <button
          className="btn btn-light border"
          onClick={() => setViewDate(next(date))}
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
