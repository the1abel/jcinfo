import React from "react";
import styles from "./OrgSelector.module.css";
import { Checkbox } from "@mui/material";

export default function OrgSelector(props) {
  const { orgs, updateList } = props;

  const handleChange = (ev) => {
    const filteredList = {};
    for (const el of document.forms.selectedOrgs.elements) {
      filteredList[el.parentElement.parentElement.innerText] = el.checked;
    }
    updateList(filteredList);
    // TODO save filteredList to localStorage with churchUnitUrlName for future visits
    console.log(filteredList); // DEBUG
  };

  return (
    <div className={styles.orgSelector}>
      <h4>Select Organizations</h4>
      <form name="selectedOrgs" onChange={handleChange}>
        {Object.keys(orgs).map(
          (o) =>
            o !== "top" && (
              <label key={o} style={{ backgroundColor: orgs[o].Color }}>
                {/* TODO set defaultChecked based on state saved from previous visit */}
                <Checkbox defaultChecked />
                {o}
              </label>
            )
        )}
      </form>
    </div>
  );
}
