import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable, findReservation } from "../utils/api";

export const SeatReservation = () => {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [reservation, setReservation] = useState({});
  const history = useHistory();

  useEffect(() => {
    listTables().then(setTables);
    findReservation(reservation_id).then(setReservation);
  }, [reservation_id]);

  const handleChange = (event) => {
    setTableId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await updateTable(reservation.reservation_id, tableId);
    history.push("/dashboard");
  };

  return (
    <section>
      <h2>Seat Reservation</h2>
      <form onSubmit={handleSubmit} className="col">
        <fieldset>
          <div className="my-3">
            <select
              id="table_id"
              name="table_id"
              value={tableId}
              required={true}
              onChange={handleChange}
            >
              <option value="">- Select a table -</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={table.table_id}
                  disabled={
                    table.capacity < reservation.people || table.occupied
                  }
                >
                  Table: {table.table_name} - Capacity: {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <button
              className="btn btn-danger ml-2"
              type="button"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <button className="btn btn-primary ml-2" type="submit">
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default SeatReservation;