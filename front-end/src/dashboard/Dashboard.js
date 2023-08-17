import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ShowAllErrors from "../layout/ShowAllErrors";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const filterResults = true;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const Abort = new AbortController();

    setReservationsError(null);
    listReservations({ date }, Abort.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(Abort.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);

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

  return (
    <main>
      <ShowAllErrors errors={reservationsError} />
      <h1>Dashboard</h1>
      <div className="row">
        <div className="d-md-flex mb-3 col">
          <h3 className="mb-0">Reservations for {date}</h3>
        </div>
        <div className="mr-4">
          <button
            className="btn btn-light border ml-2"
            onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
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
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            Next
          </button>
        </div>
      </div>
      <hr></hr>
      <div id="reservations" className="col-12">
        <ListReservations
          reservations={reservations}
          date={date}
          filterResults={filterResults}
          handleCancel={handleCancel}
        />
      </div>
      <br/>
      <div id="tables" className="item">
        <h3>Tables</h3>
        <ErrorAlert error={tablesError} />
        <hr></hr>
        <ListTables
          tables={tables}
          handleFinish={handleFinish}
          />
      </div>
    </main>
  );
  
}

export default Dashboard;