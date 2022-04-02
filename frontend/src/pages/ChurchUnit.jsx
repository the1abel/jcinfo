import Event from "../components/Event";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import styles from "./ChurchUnit.module.css";
import { useParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

export default function ChurchUnit(props) {
  const { churchUnitUrlName } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("");
  const [churchUnitDetails, setChurchUnitDetails] = useState(null);

  useEffect(() => {
    setPageTitle(churchUnitUrlName);

    setTimeout(() => {
      const info = {};
      info.events.sort((a, b) => (a.start > b.start ? 1 : -1));
      setTopOrg(info.orgs);
      // const now = new Date();
      // info.events = info.events.filter((e) => {
      //   const twoHoursAfterStart = new Date(e.start);
      //   twoHoursAfterStart.setHours(twoHoursAfterStart.getHours() + 2);
      //   if (e.finish && e.finish > now) {
      //     return true;
      //   } else if (!e.finish && twoHoursAfterStart > now) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // });

      if (!info.events.length) {
        info.events.push({
          id: 0,
          title: "There are no events nor announcements to see.",
          orgs: [info.orgs.top],
        });
      }

      setPageTitle(info.name);
      setChurchUnitDetails(info);
      setIsLoaded(true);
      setError(false);
    }, 1000);
  }, [churchUnitUrlName]);

  return (
    <React.Fragment>
      <Header title={pageTitle} />

      <main>
        <section className={styles.filterContainer}>
          <h3>Filters</h3>
        </section>
        <section className={styles.eventsContainer}>
          {!isLoaded ? (
            <CircularProgress className={styles.centered} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
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
    if (unitOrgs[org].parent.toLowerCase() === "top") {
      unitOrgs.top = org;
      return;
    }
  }
}
