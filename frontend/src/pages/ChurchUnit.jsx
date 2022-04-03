import Event from "../components/Event";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import styles from "./ChurchUnit.module.css";
import { useParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import { request } from "../utils";

export default function ChurchUnit(props) {
  const { churchUnitUrlName } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [churchUnitDetails, setChurchUnitDetails] = useState(null);
  const [includePastEvents, setIncludePastEvents] = useState(false);

  useEffect(() => {
    const url =
      "/api/ChurchUnit/" + churchUnitUrlName + (includePastEvents ? "?past=true" : "");

    request(url)
      .then((churchUnit) => {
        console.log("initial", churchUnit); // DEBUG
        setPageTitle(churchUnit.name);
        setTopOrg(churchUnit.orgs);
        localStorage.setItem(
          "lastLocation",
          window.location.href.replace(window.location.origin, "")
        );

        if (!includePastEvents) {
          // DEBUG
          // const today = new Date().toLocaleDateString("sv"); // Sweden locale is ISO format
          // churchUnit.events = churchUnit.events.filter((e) => e.finish >= today);
        }

        if (churchUnit.events?.length) {
          churchUnit.events.sort((a, b) => (a.start > b.start ? 1 : -1));
        } else {
          churchUnit.events = [
            {
              id: 0,
              title: "There are no published events nor announcements.",
              orgs: [churchUnit.orgs.top],
            },
          ];
        }

        console.log("final", churchUnit); // DEBUG
        setChurchUnitDetails(churchUnit);
        setError(null);
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setIsLoading(false));
  }, [churchUnitUrlName, includePastEvents]);

  return (
    <React.Fragment>
      <Header title={pageTitle} />

      <main>
        <section className={styles.filterContainer}>
          <h3>Filters</h3>
        </section>
        <section className={styles.eventsContainer}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : isLoading ? (
            <CircularProgress className={styles.centered} />
          ) : churchUnitDetails.events ? (
            churchUnitDetails.events.map((event) => (
              <Event key={event.id} event={event} unitOrgs={churchUnitDetails.orgs} />
            ))
          ) : (
            setError("The data finished loading without errors, but there are no events.")
          )}
        </section>
        <section className={styles.actionsContainer}></section>
      </main>
    </React.Fragment>
  );
}

function setTopOrg(unitOrgs) {
  for (const org in unitOrgs) {
    if (unitOrgs[org].Parent.toLowerCase() === "top") {
      unitOrgs.top = org;
      return;
    }
  }
}
