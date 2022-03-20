import LogInModal from "./LogInModal";
import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useState } from "react";
import styles from "./Header.module.css";
import SignUpModal from "../components/SignUpModal";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import CreateChurchUnitModal from "./CreateChurchUnitModal";

export default function Header(props) {
  const permissionsCtx = useContext(PermissionsContext);
  const isLoggedIn = permissionsCtx.isLoggedIn;

  const [signUpModalIsOpen, openSignUpModal] = useState(false);
  const [logInModalIsOpen, openLogInModal] = useState(false);
  const [createUnitModalIsOpen, openCreateUnitModal] = useState(false);

  const handleLogout = (ev) => {
    permissionsCtx.setPermissions(null);
    localStorage.removeItem("stayLoggedInEmail");
    fetch("/api/Auth/LogOut", { method: "DELETE" });
  };

  // // Subscription Request Submitted
  // const [subscriptionSubmittedOpen, setSubscriptionSubmittedOpen] = useState(false);
  // const handleSubscriptionSubmittedClose = () => setSubscriptionSubmittedOpen(false);
  // const handleSubscriptionSubmitted = ev => {
  //   ev.preventDefault();
  // };

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h2>
          <Link to="/">J.C. Info.</Link>
        </h2>
        <h2>{props.title}</h2>
        <Button
          variant={isLoggedIn ? "text" : "outlined"}
          size="small"
          className={styles.header__button}
          onClick={
            isLoggedIn ? () => openCreateUnitModal(true) : () => openSignUpModal(true)
          }
        >
          {isLoggedIn ? "Create a Church Unit" : "Sign Up"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          className={styles.header__button}
          onClick={isLoggedIn ? handleLogout : () => openLogInModal(true)}
        >
          {isLoggedIn ? "Log Out" : "Log In"}
        </Button>
      </header>

      <SignUpModal isOpen={signUpModalIsOpen} onClose={() => openSignUpModal(false)} />
      <LogInModal isOpen={logInModalIsOpen} onClose={() => openLogInModal(false)} />
      <CreateChurchUnitModal
        isOpen={createUnitModalIsOpen}
        onClose={() => openCreateUnitModal(false)}
      />

      {/* Subscription Request (need to add into a <Dialog /> component) */}
      {/* <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="subscribe"
          name="register-type"
        >
          <FormControlLabel
            value="subscribe"
            control={<Radio />}
            label="Subscribe to a church unit that is already has info at jcinfo.org"
          />
          <FormControlLabel
            value="create"
            control={<Radio />}
            label="Create a new church unit at jcinfo.org"
          />
        </RadioGroup>
      </FormControl>
      <TextField
        margin="dense"
        id="registerUnitName"
        label="Ward, Stake, or Church Name"
        type="text"
        fullWidth
        variant="standard"
      /> */}

      {/* Subscription Request Submitted */}
      {/* <Dialog open={subscriptionSubmittedOpen} onClose={handleSubscriptionSubmittedClose}>
        <form onSubmit={handleSubscriptionSubmitted}>
          <DialogTitle>Subscription Request Submitted</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your subscription request has been submitted to the church unit subscription
              manager.
              <br />
              In the meantime, you may see the info that they make available to the
              public.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained">
              Go to Public Info
            </Button>
          </DialogActions>
        </form>
      </Dialog> */}
    </React.Fragment>
  );
}
