import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useState } from "react";
import styles from "./modal.module.css";
import * as Yup from "yup";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { request } from "../utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import StayLoggedIn from "./StayLoggedIn";

export default function LogInModal(props) {
  const permissionsCtx = useContext(PermissionsContext);

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(7, "Password must be at least 7 characters, and spaces are allowed"),
  });

  // form validation (react-hook-form)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [logInError, setLogInError] = useState(null);

  const closeModal = () => {
    setLogInError(null);
    reset();
    props.onClose();
  };

  const handleLogIn = (data) => {
    setLogInError(null);

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    request("api/Auth/LogIn", opts)
      .then((res) => {
        if (res.result === "success") {
          permissionsCtx.setPermissions(res.permissions);
          closeModal();
        } else {
          setLogInError(":( Sorry, that didn't work.  Please try again");
        }
      })
      .catch((err) => setLogInError(err.toString()));
  };

  return (
    <Dialog open={props.isOpen} onClose={closeModal}>
      <form
        name="logIn"
        onSubmit={handleSubmit(handleLogIn)}
        noValidate
        className={styles.form}
      >
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="email"
            label="Email"
            {...register("email")}
            type="email"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.email?.message && (
            <Alert severity="error">{errors.email?.message}</Alert>
          )}

          <TextField
            id="password"
            label="Password"
            {...register("password")}
            type="password"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.password?.message && (
            <Alert severity="error">{errors.password?.message}</Alert>
          )}

          <StayLoggedIn />

          {logInError && <Alert severity="error">{logInError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Log In
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
