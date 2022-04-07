import EventPreview from "../components/EventPreview";
import ChurchUnitUpdateModal from "../components/ChurchUnitUpdateModal";
import EventUpsertModal from "../components/EventUpsertModal";
import Header from "../components/Header";
import OrgSelector from "../components/OrgSelector";
import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useState, useEffect } from "react";
import styles from "./ChurchUnit.module.css";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../utils";

export default function ChurchUnit() {
  const permissionsCtx = useContext(PermissionsContext);
  const permissions = permissionsCtx.permissions;
  const navigate = useNavigate();

  const { churchUnitUrlName, eventId } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [churchUnitDetails, setChurchUnitDetails] = useState(null);
  const [eventsToDisplay, setEventsToDisplay] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState({});
  const [createEventModalIsOpen, openCreateEventModal] = useState(false);
  const [churchUnitAdminModalIsOpen, openChurchUnitAdminModal] = useState(false);

  // TODO refine permissions to organizational level
  // const [churchUnitPermissions, setChurchUnitPermissions] = useState(null);
  const [canViewPrivate, setCanViewPrivate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canAdmin, setCanAdmin] = useState(false);

  // permissions
  useEffect(() => {
    const churchUnitPermissions = permissions ? permissions[churchUnitUrlName] : null;

    setCanAdmin(false);
    setCanEdit(false);
    setCanViewPrivate(false);

    if (churchUnitPermissions) {
      for (const org in churchUnitPermissions) {
        const perms = churchUnitPermissions[org];

        switch (perms) {
          case "admin":
            setCanAdmin(true);
          // falls through
          case "edit":
            setCanEdit(true);
          // falls through
          case "viewPrivate":
            setCanViewPrivate(true);
          // no default
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
        if (!churchUnit.name) {
          navigate("/");
          return;
        }

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

    // avoid a no-op memory leak console warning when navigate() is called
    return () => setChurchUnitDetails(null);
  }, [churchUnitUrlName, eventId, navigate]);

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
    } else {
      setEventsToDisplay([]);
    }
  }, [canEdit, canViewPrivate, churchUnitDetails, selectedOrgs, showPastEvents]);

  const handleAddEvent = (newEvent) => {
    const newChurchUnitDetails = structuredClone(churchUnitDetails);
    if (newChurchUnitDetails.events) {
      newChurchUnitDetails.events.push(newEvent);
    } else {
      newChurchUnitDetails.events = [newEvent];
    }
    setChurchUnitDetails(newChurchUnitDetails);
  };

  const handleEditEvent = (editedEvent) => {
    const newChurchUnitDetails = structuredClone(churchUnitDetails);
    newChurchUnitDetails.events = newChurchUnitDetails.events.map((event) => {
      if (event.id !== editedEvent.id) {
        return event;
      } else {
        return editedEvent;
      }
    });
    setChurchUnitDetails(newChurchUnitDetails);
  };

  return (
    <React.Fragment>
      <Header title={pageTitle} />

      <main>
        <section className={styles.filterContainer}>
          {churchUnitDetails?.orgs && (
            <OrgSelector
              orgs={churchUnitDetails.orgs}
              updateListOfEvents={setSelectedOrgs}
            />
          )}
        </section>
        <section className={styles.eventsContainer}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : isLoading ? (
            <CircularProgress className={styles.centered} />
          ) : eventsToDisplay ? (
            eventsToDisplay.map((event) => (
              <EventPreview
                key={event.id}
                event={event}
                unitOrgs={churchUnitDetails.orgs}
                canEdit={canEdit}
                canViewPrivate={canViewPrivate}
                onEditEvent={handleEditEvent}
                eventIdToOpen={eventId}
              />
            ))
          ) : (
            <EventPreview
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
            <React.Fragment>
              <Button
                variant="outlined"
                size="small"
                onClick={() => openCreateEventModal(true)}
              >
                Create new event
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowPastEvents(!showPastEvents)}
              >
                {showPastEvents ? "Hide" : "Show"} past events
              </Button>
            </React.Fragment>
          )}

          {canAdmin && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => openChurchUnitAdminModal(true)}
            >
              Church Unit Admin
            </Button>
          )}
        </section>
      </main>

      {canEdit && (
        <EventUpsertModal
          event={{}}
          unitOrgs={churchUnitDetails?.orgs || {}}
          onAddEvent={handleAddEvent}
          isOpen={createEventModalIsOpen}
          onClose={() => openCreateEventModal(false)}
        />
      )}

      {canAdmin && (
        <ChurchUnitUpdateModal
          unitOrgs={churchUnitDetails?.orgs || {}}
          isOpen={churchUnitAdminModalIsOpen}
          onClose={() => openChurchUnitAdminModal(false)}
        />
      )}
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
