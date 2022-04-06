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
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { request } from "../utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ChurchUnitUpdateModal(props) {
  const permissionsCtx = useContext(PermissionsContext);

  const [userPermissionMsg, setUserPermissionMsg] = useState(null);

  // verify user is valid
  const verifyValidUser = async (email, yupTestInfoObj) => {
    if (!email) return false;

    // TODO wait for a pause in user input before fetching
    return await request("/api/Auth/IsUniqueEmail/" + encodeURIComponent(email))
      .then((res) => !res.result)
      .catch((err) => {
        setUserPermissionMsg({ severity: "error", msg: err.toString() });
        return false;
      });
  };

  // form validation schema (yup)
  const invalidEmailMsg = "Please provide a registered user's email address.";
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(invalidEmailMsg)
      .email(invalidEmailMsg)
      .test("verifyValidUser", invalidEmailMsg, verifyValidUser),
    permission: Yup.string().required("A permission level must be selected"),
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
  });

  const closeModal = () => {
    setUserPermissionMsg("");
    reset();
    props.onClose();
  };

  const setUserPermissions = (data) => {
    const notLoggedInMsg = "You must be logged in to edit permissions.";

    if (!permissionsCtx.isLoggedIn) {
      setUserPermissionMsg({ severity: "error", msg: notLoggedInMsg });
      return;
    }

    setUserPermissionMsg(null);
    data.churchUnitUrlName = window.location.pathname.slice(1);
    data.org = "all";

    const opts = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };

    request("api/Auth/Permissions", opts)
      .then((res) => {
        if (res.result === "Success") {
          closeModal();
        } else if (res.result === "ErrorNotLoggedIn") {
          setUserPermissionMsg({ severity: "error", msg: notLoggedInMsg });
          setTimeout(() => permissionsCtx.setPermissions(null), 3000);
        } else {
          setUserPermissionMsg({
            severity: "error",
            msg:
              "Oops.  There was an error updating the user's permissions.  Please try again.  " +
              res.result,
          });
        }
      })
      .catch((err) => setUserPermissionMsg({ severity: "error", msg: err.toString() }));
  };

  return (
    <Dialog open={props.isOpen} onClose={closeModal}>
      <form
        name="updateChurchUnit"
        onSubmit={handleSubmit(setUserPermissions)}
        noValidate
        className={styles.form}
      >
        <DialogTitle>Church Unit Administration</DialogTitle>
        <DialogContent>
          <DialogContentText>Set permissions for a user</DialogContentText>
          <TextField
            autoFocus
            id="email"
            label="User's registered email address"
            {...register("email")}
            type="email"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.email?.message && (
            <Alert severity="info">{errors.email?.message}</Alert>
          )}

          <Select
            id="permission"
            defaultValue={"viewPublic"}
            {...register("permission")}
            autoWidth
          >
            {Object.keys(VALID_PERMISSIONS).map((perm) => (
              <MenuItem key={perm} value={perm}>
                {VALID_PERMISSIONS[perm]}
              </MenuItem>
            ))}
          </Select>
          {errors.permission?.message && (
            <Alert severity="error">{errors.permission?.message}</Alert>
          )}

          {userPermissionMsg && (
            <Alert severity={userPermissionMsg.severity}>{userPermissionMsg.msg}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const VALID_PERMISSIONS = {
  viewPublic: "Public View-only",
  viewPrivate: "Subscriber View-only",
  edit: "Create & Edit Events",
  admin: "Church Unit Admin",
};
