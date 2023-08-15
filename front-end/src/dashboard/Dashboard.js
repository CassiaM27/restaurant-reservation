import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory, useLocation } from "react-router-dom";
import ListReservations from "../reservations/ListReservations";
//import ListTables from "../tables/ListTables";



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = new URLSearchParams(useLocation().search);
  const viewDate = query.get("date")
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const filterResults = true;

  //useEffect(loadDashboard, [date]);

  /*
  if(viewDate !== null && viewDate !== date) {
    setReservationDate(viewDate)
  }
  */

  useEffect(() => {
    const Abort = new AbortController();
    async function loadDashboard() {
    try {
      setReservationsError(null);
      setReservationDate(viewDate)
      const list = await listReservations({reservationDate}, Abort.signal)
      setReservations(list)
    }
    catch (error) {
      setReservationsError(error);
    }
    return () => Abort.abort();
  }
  loadDashboard(reservationDate)
  }, [viewDate, reservationDate]);

  function loadDashboard() {
    const Abort = new AbortController();

    setReservationsError(null);
    listReservations({ date }, Abort.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables().then(setTables);

    return () => Abort.abort();
  }

const handleCancel = async (event) => {
  const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
  if (result) {
    await updateStatus(event.target.value, "cancelled");
    loadDashboard();
  }
};

async function handleFinish(table_id) {
  const Abort = new AbortController();
  const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

  if (result) {
    await finishTable(table_id, Abort.signal);
    loadDashboard();
  }
  return () => Abort.abort();
}

/*
  const allReservations = reservations.map((reservation) => {
    if(reservation.reservation_date === date) {
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
    }
  })
*/

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h3 className="mb-0">Reservations for {reservationDate}</h3>
      </div>
      <div>
        <button
          className="btn btn-light border ml-2"
          onClick={() => history.push(`/dashboard?date=${previous(viewDate)}`)}
        >
          Previous
        </button>
        <button
          className="btn btn-light border mx-2"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-light border"
          onClick={() => history.push(`/dashboard?date=${next(viewDate)}`)}
        >
          Next
        </button>
      </div>
      <hr></hr>
      <div id="reservations" className="col-12">
        <ListReservations
          reservations={reservations}
          filterResults={filterResults}
          handleCancel={handleCancel}
        />
      </div>

      <div id="tables" className="item">
        <h3>Tables</h3>
        <hr></hr>
        {/*<ListTables tables={tables} handleFinish={handleFinish} />*/}
      </div>
    </main>
  );
  
}

export default Dashboard;