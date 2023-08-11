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
  const [reservationDate, setReservationDate] = useState(date)

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDashboard() {
    try {
      setReservationsError(null);
      const list = await listReservations({reservationDate}, abortController.signal)
      setReservations(list)
    }
    catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  }
  loadDashboard(reservationDate)
  }, [reservationDate]);

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
        <h4 className="mb-0">Reservations for {reservationDate}</h4>
      </div>
      <div>
        <button
          className="btn btn-light border ml-2"
          onClick={() => setReservationDate(previous(date))}
        >
          Previous
        </button>
        <button
          className="btn btn-light border mx-2"
          onClick={() => setReservationDate(today())}
        >
          Today
        </button>
        <button
          className="btn btn-light border"
          onClick={() => setReservationDate(next(date))}
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
