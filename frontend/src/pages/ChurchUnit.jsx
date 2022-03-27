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
      info.events.sort((a, b) => (a.expiration > b.expiration ? 1 : -1));
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
        <div className={styles.filterContainer}>
          <h3>Filters</h3>
        </div>
        <div className={styles.eventsContainer}>
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
        </div>
        <div className={styles.actionsContainer}></div>
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

/**
 * Filler data
 */
const info = {
  name: "Rancho California Ward",
  urlName: "ranchocaliforniaward",
  orgs: {
    Ward: { parent: "top", color: "var(--grey-20)" },
    "Elders Quorum": { parent: "Ward", color: "var(--purple-mountain-majesty)" },
    "Young Men": { parent: "Ward", color: "var(--cornflower)" },
    "Priests Quorum": { parent: "Young Men", color: "var(--soft-blue)" },
    "Teachers Quorum": { parent: "Young Men", color: "var(--cornflower-blue)" },
    "Deacons Quorum": { parent: "Young Men", color: "var(--blue-curacao)" },
    "Relief Society": { parent: "Ward", color: "var(--rogue-pink)" },
    "Young Women": { parent: "Ward", color: "var(--old-geranium)" },
    "16-17 Year-old Young Women": { parent: "Young Women", color: "var(--tiger-lilly)" },
    "14-15 Year-old Young Women": {
      parent: "Young Women",
      color: "var(--porcelain-rose)",
    },
    "12-13 Year-old Young Women": {
      parent: "Young Women",
      color: "var(--brewed-mustard)",
    },
    Primary: { parent: "Ward", color: "var(--rosy-highlight)" },
  },
  events: [
    {
      id: 0,
      title: "General Conference",
      orgs: ["Ward"],
      type: "Event",
      // doDisplayTime: true,
      start: "2022-04-02T10:00:00.000",
      finish: "2022-04-03T16:00:00.000",
      publicDescription:
        "Please remember to pray for personal revelation before, during, and after.",
      privateDescription: "Please invite family and friends to watch!",
      location: "www.churchofjesuschrist.org",
    },
    {
      id: 1,
      title: "Sacrament Meeting",
      orgs: ["Ward"],
      type: "Event",
      doDisplayTime: true,
      expiration: "2022-03-27T11:30:00.000",
      start: "2022-03-27T10:30:00.000",
      publicDescription: "This is great stuff!",
      privateDescription:
        "Member notes go here, but probably doesn't apply to Sacrament Meeting.",
      location: null,
    },
    {
      id: 2,
      title: "Volleyball",
      orgs: ["Elders Quorum"],
      type: "Event",
      doDisplayTime: true,
      start: "2022-03-25T19:00:00.000",
      finish: "2022-03-25T21:00:00.000",
      expiration: "2022-03-25T21:00:00.000",
      publicDescription: "Women, children, neighbors, everyone is welcome!",
      privateDescription: "Please invite others! :)",
      location: null,
    },
    {
      id: 3,
      title: "Crafting Your Testimony",
      orgs: ["Relief Society"],
      type: "Event",
      doDisplayTime: true,
      start: "2022-03-31T19:00:00.000",
      finish: "2022-03-31T20:30:00.000",
      expiration: "2022-03-31T20:30:00.000",
      publicDescription: "Friends & neighbors are welcome!",
      privateDescription: "Please invite others! :)",
      location: null,
    },
    {
      id: 4,
      title: "Mutual: Return Missionary Q&A",
      orgs: ["Deacons Quorum", "Teachers Quorum"],
      type: "Event",
      start: "2022-03-30T19:00:00.000",
      expiration: "2022-03-30T20:00:00.000",
      publicDescription: "Women, children, neighbors, everyone is welcome!",
      privateDescription: "Please invite others! :)",
      location: null,
    },
    {
      id: 5,
      title: "Group Date Night",
      orgs: ["Priests Quorum", "16-17 Year-old Young Women"],
      type: "Event",
      doDisplayTime: true,
      start: "2022-04-08T17:00:00.000",
      finish: "2022-04-08T20:30:00.000",
      expiration: "2022-04-08T20:30:00.000",
      publicDescription: "Dinner, speed dating, and a miniature golf.",
      location: "Chipotle, then Gulf N' More",
    },
    {
      id: 6,
      title: "Mutual: Mission Prep Q&A",
      orgs: ["Young Women"],
      type: "Event",
      doDisplayTime: true,
      start: "2022-03-30T19:00:00.000",
      expiration: "2022-03-30T20:00:00.000",
      publicDescription: "Women, children, neighbors, everyone is welcome!",
      privateDescription: "Please invite others! :)",
      location: null,
    },
  ],
};
