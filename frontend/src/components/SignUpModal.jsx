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

export default function SignUpModal(props) {
  const permissionsCtx = useContext(PermissionsContext);

  // verify email is unique
  const verifyUniqueUser = async (email, yupTestInfoObj) => {
    if (!email) return false;

    // TODO wait for a pause in user input before fetching
    return await request("/api/Auth/IsUniqueEmail/" + encodeURIComponent(email))
      .then((res) => res.result)
      .catch((err) => {
        setSignUpError(err.toString());
        return false;
      });
  };

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address.")
      .test(
        "verifyUniqueUser",
        "A user already has that email. Did you mean to Log In?",
        verifyUniqueUser
      ),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(7, "Password must be at least 7 characters, and spaces are allowed"),
    password2: Yup.string()
      .required("Password must be retyped")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });

  // form validation (react-hook-form)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    validationSchema,
  });

  const [signUpError, setSignUpError] = useState(null);

  const closeModal = () => {
    setSignUpError(null);
    reset();
    props.onClose();
  };

  // sign up
  const handleSignUp = (data) => {
    setSignUpError(null);

    delete data.password2;
    data.permissions = {};
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };

    request("/api/Auth/SignUp", opts)
      .then((res) => {
        if (res.result === "Success") {
          permissionsCtx.setPermissions(res.permissions);
          closeModal();
        } else {
          setSignUpError(
            `An error occurred (${res.result}).  Please try again.  ` +
              "If the problem persists, please contact us at abelw@live.com"
          );
        }
      })
      .catch((err) => setSignUpError(err.toString()));
  };

  return (
    <Dialog open={props.isOpen} onClose={closeModal}>
      <form
        name="signUp"
        onSubmit={handleSubmit(handleSignUp)}
        noValidate
        className={styles.form}
      >
        <DialogTitle>Sign Up</DialogTitle>
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
            <Alert severity={errors.email.message.match(/please/i) ? "info" : "error"}>
              {errors.email?.message}
            </Alert>
          )}

          <TextField
            id="firstName"
            label="First Name"
            {...register("firstName")}
            type="text"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.firstName?.message && (
            <Alert severity="error">{errors.firstName?.message}</Alert>
          )}

          <TextField
            id="lastName"
            label="Last Name"
            {...register("lastName")}
            type="text"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.lastName?.message && (
            <Alert severity="error">{errors.lastName?.message}</Alert>
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

          <TextField
            id="password2"
            label="Password (again)"
            {...register("password2")}
            type="password"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.password2?.message && (
            <Alert severity="error">{errors.password2?.message}</Alert>
          )}

          <StayLoggedIn />

          {signUpError && <Alert severity="error">{signUpError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Sign Up
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
