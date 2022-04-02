import React from "react";
import styles from "./Event.module.css";

export default function Event(props) {
  const { event, unitOrgs } = props;

  const colors = event.orgs.map((org) => unitOrgs[org]?.color || "var(--grey-20)");

  const background =
    colors.length === 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`;

  return (
    <div style={{ background }} className={styles.event}>
      <h3>
        {event.title}
        {event.orgs[0] !== unitOrgs.top && (
          <span className={styles.orgTitle}>({event.orgs.join(", ")})</span>
        )}
      </h3>
      <h4>{formatEventDateTimeRange(event)}</h4>
    </div>
  );
}

const lang = navigator.language;

function formatEventDateTimeRange(event) {
  if (event.type !== "Event" || !event.start) {
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
