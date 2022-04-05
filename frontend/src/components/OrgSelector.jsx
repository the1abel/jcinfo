import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useEffect, useState } from "react";
import styles from "./OrgSelector.module.css";
import { Checkbox } from "@mui/material";

export default function OrgSelector(props) {
  const permissionsCtx = useContext(PermissionsContext);
  const { loggedInUser } = permissionsCtx;
  const { orgs, updateListOfEvents } = props;

  const [selectedOrgs, setSelectedOrgs] = useState(orgs);
  const handleChangeOneSelectedOrg = (org) => {
    const newSelectedOrgs = structuredClone(selectedOrgs);
    newSelectedOrgs[org] = !selectedOrgs[org];
    updateListOfEvents(newSelectedOrgs);
    setSelectedOrgs(newSelectedOrgs);

    if (loggedInUser) {
      localStorage.setItem(
        "selectedOrgs_" + loggedInUser,
        JSON.stringify(newSelectedOrgs)
      );
    }
  };

  useEffect(() => {
    const savedSelectedOrgs =
      loggedInUser && JSON.parse(localStorage.getItem("selectedOrgs_" + loggedInUser));

    if (savedSelectedOrgs) {
      updateListOfEvents(savedSelectedOrgs);
      setSelectedOrgs(savedSelectedOrgs);
    } else if (!loggedInUser) {
      // if user logs out, select all orgs
      updateListOfEvents(orgs);
      setSelectedOrgs(orgs);
    }
  }, [loggedInUser, orgs, updateListOfEvents]);

  return (
    <div className={styles.orgSelector}>
      <h4>Select Organizations</h4>
      <div>
        {Object.keys(orgs).map(
          (org) =>
            org !== "top" && (
              <label key={org} style={{ backgroundColor: orgs[org].Color }}>
                <Checkbox
                  checked={!!selectedOrgs[org]}
                  onChange={() => handleChangeOneSelectedOrg(org)}
                />
                {org}
              </label>
            )
        )}
      </div>
    </div>
  );
}
