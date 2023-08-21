import React from "react";
import { Link } from "react-router-dom";
import { formatAsDate } from "../utils/date-time";

export const ListReservations = ({
  reservations,
  handleCancel,
  filterResults,
}) => {
  // Filters out reservations that are finished or cancelled
  function checkStatus(reservation) {
    return (
      reservation.status === "finished" || reservation.status === "cancelled"
    );
  }

  // Formats HH:MM time as 12-hour AM/PM time
  function formatTime(time) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
  }

  function renderReservations(reservations) {
    if (reservations.length) {
      return reservations.map((reservation) => {
        // Dashboard shows only booked and seated results, whereas Search shows all results
        return filterResults && checkStatus(reservation) ? (
          ""
        ) : (
          <div className="m-2 border rounded pt-2 row" key={reservation.reservation_id}>
          <div className="col-6 px-4">
            <p className="">{reservation.first_name} {reservation.last_name}</p>
            <p className="">Party of {reservation.people}</p>
            <p className="">Mobile # {reservation.mobile_number}</p>
            <p
              data-reservation-id-status={reservation.reservation_id}
            >
              Status: {reservation.status}
            </p>
          </div>
          <div className="col-6 px-4">
            <p className="text-right">{formatTime(reservation.reservation_time)}</p>
            <p className="text-right">{formatAsDate(reservation.reservation_date)}</p>
            <button
              type="cancel"
              data-reservation-id-cancel={reservation.reservation_id}
              value={reservation.reservation_id}
              className="btn btn-danger mb-2 mx-2 float-right"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Link
              href={`/reservations/${reservation.reservation_id}/edit`}
              className="btn btn-secondary ml-2 mb-2 px-4 float-right"
            >
              Edit
            </Link>
            { reservation.status === "booked"
              ? (
                <Link
                  type="submit"
                  className="btn btn-primary mb-2 px-4 float-right"
                  href={`/reservations/${reservation.reservation_id}/seat`}
                >
                  Seat
                </Link>
                )
              : ( "" )
            }
          </div>
        </div>
        );
      });
    } else {
      return (
        <div>
          <h4>No reservations found</h4>
        </div>
      );
    }
  }

  return <div>{renderReservations(reservations)}</div>;
};

export default ListReservations;