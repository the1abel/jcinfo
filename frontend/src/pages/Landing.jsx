import React from "react";
import {
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import Home from "@mui/icons-material/Home";
import styles from "./Landing.module.css";
import Header from "../components/Header";

export default function Landing() {
  const goToInfo = ev => {
    ev.preventDefault();
    const unit = document.getElementById('unitName').value;
    document.location.pathname =
        encodeURIComponent(unit.toLocaleLowerCase().replaceAll(' ', ''));
  };

  return (
    <React.Fragment>
      <Header />

      <main className={styles.main}>
        <form onSubmit={goToInfo} className={styles.form}>
          <TextField
            id="unitName"
            label="Church Unit Name"
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
          <div className={styles.form__row_rightAlign}>
            <Button type="submit" variant="contained">Go</Button>
          </div>
        </form>
      </main>

      <footer className={styles.footer}></footer>
    </React.Fragment>
  );
}
