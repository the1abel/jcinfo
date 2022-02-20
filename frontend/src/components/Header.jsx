import React, { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import styles from "./Header.module.css";

export default function Header(props) {
  // TODO use Context to maintain isLoggedIn and stayLogged in state
  const [isLoggedIn, setLoggedIn] = useState(props.isLoggedIn || false);

  // Log In
  const [loginOpen, setLoginOpen] = useState(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogin = (ev) => {
    ev.preventDefault();
    setLoggedIn(true);
    handleLoginClose();
  };

  const handleLogout = (ev) => {
    ev.preventDefault();
    setLoggedIn(false);
  };

  // Stay Logged In
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  // Sign Up
  const [signUpOpen, setSignUpOpen] = useState(false);
  const handleSignUpClose = () => setSignUpOpen(false);
  const handleSignUp = (ev) => {
    ev.preventDefault();
    setSubscriptionSubmittedOpen(true);
  };

  // Subscription Request Submitted
  const [subscriptionSubmittedOpen, setSubscriptionSubmittedOpen] = useState(false);
  const handleSubscriptionSubmittedClose = () => setSubscriptionSubmittedOpen(false);
  const handleSubscriptionSubmitted = (ev) => {
    ev.preventDefault();
  };

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h2>J.C. Info.</h2>
        <h2>{props.title}</h2>
        <Button
          variant="outlined"
          size="small"
          className={styles.header__button}
          onClick={() => setSignUpOpen(true)}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          size="small"
          className={styles.header__button}
          onClick={isLoggedIn ? handleLogout : () => setLoginOpen(true)}
        >
          {isLoggedIn ? "Log Out" : "Log In"}
        </Button>
      </header>

      {/* Log In */}
      <Dialog open={loginOpen} onClose={handleLoginClose}>
        <form onSubmit={handleLogin}>
          <DialogTitle>Log In</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="email"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => setStayLoggedIn(!stayLoggedIn)}
                  checked={stayLoggedIn}
                />
              }
              label="Stay Logged In"
            />
            {
              // conditional alert
              stayLoggedIn &&
              <Alert severity="error">
                Do NOT "stay logged in" if this is not your own private device!
              </Alert>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLoginClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Log In
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Sign Up */}
      <Dialog open={signUpOpen} onClose={handleSignUpClose}>
        <form onSubmit={handleSignUp}>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogContent>
            <FormControl>
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
            />
            <TextField
              margin="dense"
              id="newUsername"
              label="email"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="newPassword1"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="newPassword2"
              label="Password (again)"
              type="password"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSignUpClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Sign Up
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Subscription Request Submitted */}
      <Dialog open={subscriptionSubmittedOpen} onClose={handleSubscriptionSubmittedClose}>
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
      </Dialog>
    </React.Fragment>
  );
}
