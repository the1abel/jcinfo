import React, { useState } from "react";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";


export default function StayLoggedIn() {
  const [isStayLoggedInChecked, setIsStayLoggedInChecked] = useState(false);

  return (
    <React.Fragment>
      <FormControlLabel
        label="Stay Logged In"
        name="stayLoggedIn"
        id="stayLoggedIn"
        control={
          <Checkbox
            onChange={() => setIsStayLoggedInChecked(!isStayLoggedInChecked)}
            checked={isStayLoggedInChecked}
          />
        }
      />
      {isStayLoggedInChecked && (
        <Alert severity="warning">
          Do NOT "stay logged in" unless this is your own private device!
        </Alert>
      )}
    </React.Fragment>
  )
}
