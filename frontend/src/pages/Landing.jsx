import Header from "../components/Header";
import Home from "@mui/icons-material/Home";
import React, { useState } from "react";
import styles from "./Landing.module.css";
import { Alert, Button, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { request } from "../utils";

export default function Landing() {
  const navigate = useNavigate();
  const [navigateError, setNavigateError] = useState(null);

  const goToInfo = (ev) => {
    ev.preventDefault();
    const name = document.getElementById("unitName").value;

    request("api/ChurchUnit/IsUniqueName/" + name)
      .then((res) => {
        if (!res.result) navigate("/" + res.urlName);
        else
          setNavigateError(
            "There is no Church Unit by that name.  You can log in and create it."
          );
      });
  };

  return (
    <React.Fragment>
      <Header />

      <main className={styles.main}>
        <form onSubmit={goToInfo} className={styles.form}>
          <TextField
            id="unitName"
            label="Church Unit Name"
            onChange={() => setNavigateError(null)}
            fullWidth
            InputProps={{
              autoFocus: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Home />
                </InputAdornment>
              ),
            }}
          />
          {navigateError && <Alert severity="error">{navigateError}</Alert>}
          <div className={styles.form__row_rightAlign}>
            <Button type="submit" variant="contained">
              Go
            </Button>
          </div>
        </form>
      </main>

      <footer className={styles.footer}></footer>
    </React.Fragment>
  );
}
