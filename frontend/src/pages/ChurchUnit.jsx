import Event from "../components/Event";
import Header from "../components/Header";
import OrgSelector from "../components/OrgSelector";
import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useState, useEffect } from "react";
import styles from "./ChurchUnit.module.css";
import { useParams } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import { request } from "../utils";

export default function ChurchUnit() {
  const permissionsCtx = useContext(PermissionsContext);
  const permissions = permissionsCtx.permissions;

  const { churchUnitUrlName } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [churchUnitDetails, setChurchUnitDetails] = useState(null);
  const [eventsToDisplay, setEventsToDisplay] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState({});

  // TODO refine permissions to organizational level
  // const [churchUnitPermissions, setChurchUnitPermissions] = useState(null);
  const [canViewPrivate, setCanViewPrivate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  // permissions
  useEffect(() => {
    const churchUnitPermissions = permissions ? permissions[churchUnitUrlName] : null;

    setCanEdit(false);
    setCanViewPrivate(false);

    if (churchUnitPermissions) {
      for (const org in churchUnitPermissions) {
        const p = churchUnitPermissions[org];
        if (p === "admin" || p === "edit") {
          setCanEdit(true);
          setCanViewPrivate(true);
          break;
        } else if (p === "viewPrivate") {
          setCanViewPrivate(true);
        }
      }
    }

    // setChurchUnitPermissions(churchUnitPermissions);
  }, [permissions, churchUnitUrlName]);

  //  fetch Church Unit details
  useEffect(() => {
    const url = "/api/ChurchUnit/" + churchUnitUrlName;
      // TODO implement filter past events in backend service's query
      //  + (showPastEvents ? "?past=true" : "");

    request(url)
      .then((churchUnit) => {
        setPageTitle(churchUnit.name);
        setTopOrg(churchUnit.orgs);
        localStorage.setItem(
          "lastLocation",
          window.location.href.replace(window.location.origin, "")
        );

        // sort events
        if (churchUnit.events?.length) {
          churchUnit.events.sort((a, b) => (a.start > b.start ? 1 : -1));
        }

        // TODO sort orgs by .Order field

        setSelectedOrgs(churchUnit.orgs);
        setChurchUnitDetails(churchUnit);
        setError(null);
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setIsLoading(false));
  }, [churchUnitUrlName]);

  // filter events
  useEffect(() => {
    if (churchUnitDetails?.events) {
      const today = new Date().toLocaleDateString("sv"); // Sweden locale is ISO format

      setEventsToDisplay(
        churchUnitDetails.events.filter((e) => {
          if (e.finish < today && (!canEdit || (canEdit && !showPastEvents))) {
            // filter past events
            return false;
          } else if (!canViewPrivate && e.isForMembersOnly) {
            // filter private events
            return false;
          } else if (!hasSelectedOrg(e.orgs, selectedOrgs)) {
            // filter selected orgs
            return false;
          } else {
            return true;
          }
        })
      );
    }
  }, [canEdit, canViewPrivate, churchUnitDetails, selectedOrgs, showPastEvents]);

  return (
    <React.Fragment>
      <Header title={pageTitle} />

      <main>
        <section className={styles.filterContainer}>
          {churchUnitDetails?.orgs && (
            <OrgSelector orgs={churchUnitDetails.orgs} updateList={setSelectedOrgs} />
          )}
        </section>
        <section className={styles.eventsContainer}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : isLoading ? (
            <CircularProgress className={styles.centered} />
          ) : eventsToDisplay ? (
            eventsToDisplay.map((event) => (
              <Event
                key={event.id}
                event={event}
                unitOrgs={churchUnitDetails.orgs}
                canEdit={canEdit}
                canViewPrivate={canViewPrivate}
              />
            ))
          ) : (
            <Event
              key={0}
              event={{
                title: "There are no published events nor announcements.",
                isAnnouncement: true,
                orgs: [churchUnitDetails.orgs.top],
              }}
              unitOrgs={churchUnitDetails.orgs}
            />
          )}
        </section>
        <section className={styles.actionsContainer}>
          {canEdit && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowPastEvents(!showPastEvents)}
            >
              {showPastEvents ? "Hide" : "Show"} past events
            </Button>
          )}
        </section>
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

function hasSelectedOrg(eventOrgs, selectedOrgs) {
  for (const o of eventOrgs) {
    if (selectedOrgs[o]) {
      return true;
    }
  }
  return false;
}
