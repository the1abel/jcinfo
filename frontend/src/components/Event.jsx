import EventUpsertModal from "./EventUpsertModal";
import React, { useState } from "react";
import styles from "./Event.module.css";
import { Button } from "@mui/material";

export default function Event(props) {
  const { canEdit, canViewPrivate, event, unitOrgs } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => setIsExpanded(!isExpanded);

  const [eventUpsertModalIsOpen, openEventUpsertModal] = useState(false);

  const colors = event.orgs.map((org) => unitOrgs[org]?.Color || "var(--grey-20)");

  const background =
    colors.length === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`;

  return (
    <div style={{ background }} className={styles.event} onClick={handleExpand}>
      <h3>
        {event.title}
        {event.orgs[0] !== unitOrgs.top && (
          <span className={styles.orgTitle}>({event.orgs.join(", ")})</span>
        )}
        {canEdit && (
          // TODO replace edit button with icon
          <Button onClick={() => openEventUpsertModal(true)} className={styles.editBtn}>
            Edit
          </Button>
        )}
      </h3>
      <h4>{!event.isAnnouncement && formatEventDateTimeRange(event)}</h4>
      <h4>{event.headline}</h4>
      {isExpanded && (
        <div>
          {event.location && <p>Location: {event.location}</p>}
          {event.publicDescription && <p>{event.publicDescription}</p>}
          {canViewPrivate && event.membersOnlyDescription && (
            <p>{event.membersOnlyDescription}</p>
          )}
        </div>
      )}

      <EventUpsertModal
        event={event}
        unitOrgs={unitOrgs}
        isOpen={eventUpsertModalIsOpen}
        onClose={() => openEventUpsertModal(false)}
        onEditEvent={props.onEditEvent}
      />
    </div>
  );
}

const lang = navigator.language;

function formatEventDateTimeRange(event) {
  if (event.isAnnouncement) {
    return null;
  }

  const start = new Date(event.start);
  const finish = event.finish && new Date(event.finish);

  const dayOpts = { weekday: "short", month: "numeric", day: "numeric" };
  const timeOpts = { hour: "numeric", minute: "numeric" };

  const startDay = start.toLocaleString(lang, dayOpts);
  let finishDay = finish && finish.toLocaleString(lang, dayOpts);
  const isSameDay = finish && startDay === finishDay;

  let output;

  if (event.doDisplayTime) {
    output = start.toLocaleString(lang, { ...dayOpts, ...timeOpts });
  } else {
    output = start.toLocaleString(lang, dayOpts);
  }

  if (!finish || (isSameDay && !event.doDisplayTime)) {
    return output;
  }
  output += " - ";

  if (!isSameDay && event.doDisplayTime) {
    // TODO use RegEx to check for AM/a.m./a. m., `gi`, and if there are 2 matches and
    // those 2 matches match each other, then .remove(match[0] + ' -', ' -')
    // so that 2:00 PM - 3:00 PM is just 2:00 - 3:00 PM
    output += finish.toLocaleString(lang, { ...dayOpts, ...timeOpts });
  } else if (!isSameDay) {
    output += finish.toLocaleString(lang, dayOpts);
  } else {
    output += finish.toLocaleString(lang, timeOpts);
  }

  return output;
}
