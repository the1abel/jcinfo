import React from "react";
import { Button, FormGroup, InputAdornment, TextField } from "@mui/material";
import Home from "@mui/icons-material/Home";
import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <React.Fragment>
      <header>
        <Button variant="outlined" size="small" className={styles.header__button}>
          Sign Up
        </Button>
        <Button variant="contained" size="small" className={styles.header__button}>
          Log In
        </Button>
      </header>

      <main>
        <FormGroup className={styles.formGroup}>
          <TextField
            id="unit-name"
            label="Ward, Stake, or Church Name"
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
          <div className={styles.formGroup__row_rightAlign}>
            <Button variant="contained">Go</Button>
          </div>
        </FormGroup>
      </main>

      <footer></footer>
    </React.Fragment>
  );
}
