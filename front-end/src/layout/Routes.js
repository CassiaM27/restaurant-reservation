import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../seat/SeatReservation";
import NewTable from "../tables/NewTable";
import Search from "../search/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  return (
    <Switch>
      {/* the routes that follow define the homepage*/}
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      {/* end of homepage routes*/}

      {/* the following routes define the reservations path*/}
      <Route path="/reservations/new">
        <NewReservation />
      </Route>
      
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      {/* end of reservations path*/}

      <Route path="/tables/new">
        <NewTable />
      </Route>
      
      <Route path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;