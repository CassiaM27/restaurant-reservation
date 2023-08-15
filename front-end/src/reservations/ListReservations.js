import React from "react";
import { Link, useHistory } from "react-router-dom";
import { formatAsDate } from "../utils/date-time";

export const ListReservations = ({ reservations, handleCancel, filterResults }) => {

  const history = useHistory();

  // Reformats HH:MM time as 12-hour AM/PM time
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

  //Filters out reservations that are finished or cancelled
  function checkStatus(reservation) {
    return (
      reservation.status === "finished" || reservation.status === "cancelled"
    );
  }

  function renderReservations(reservations) {
    if (reservations.length) {
      return reservations.map((reservation) => {
        //Dashboard shows only booked and seated results, whereas Search shows all results
        return filterResults && checkStatus(reservation) ? (
          ""
        ) : (
          <div className="reservation border rounded m-2 p-2 col" key={reservation.reservation_id}>
            <div className="mx-3">
              <h4 className="row pl-3">
                {reservation.first_name}&nbsp;{reservation.last_name}&nbsp;
              </h4>
              <div className="row">
                <div className="col">
                  <p className="text-left">Party of {reservation.people}</p>
                </div>
                <div className="col">
                  <p className="text-right">
                    {formatAsDate(reservation.reservation_date)}&nbsp;/&nbsp;{formatTime(reservation.reservation_time)}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p>Mobile Phone : {reservation.mobile_number}</p>
                </div>
                <div className="col">
                  <p data-reservation-id-status={reservation.reservation_id}>
                    <i>{reservation.status}</i>
                  </p>
                </div>
              </div>
            </div>
            <div className="item">
              {reservation.status === "booked" ? (
                <div className="group-reverse">
                  <button
                    className="btn"
                    onClick={history.push(`/reservations/${reservation.reservation_id}/seat`)}
                  >
                    Seat
                  </button>
                  <button
                    className="btn"
                    onClick={history.push(`/reservations/${reservation.reservation_id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="item black"
                    type="button"
                    data-reservation-id-cancel={reservation.reservation_id}
                    value={reservation.reservation_id}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="group">
          <h4>No reservations found</h4>
        </div>
      );
    }
  }

  return <div>{renderReservations(reservations)}</div>;
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

export default ListReservations;