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

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("A valid user must be selected"),
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

  const [userPermissionMsg, setUserPermissionMsg] = useState(null);
  const verifyValidUser = (ev) => {
    // TODO wait for a pause in user input before fetching
    request("/api/Auth/IsUniqueEmail?email=" + encodeURIComponent(ev.target.value))
      .then((res) => {
        if (res.result === true) {
          setUserPermissionMsg({
            severity: "info",
            msg: "Please provide a registered user's email address.",
          });
        } else if (res.result === false) {
          setUserPermissionMsg(null);
        }
      })
      .catch((err) => setUserPermissionMsg({ severity: "error", msg: err.toString() }));
  };

  const setUserPermissions = (data) => {
    if (!permissionsCtx.isLoggedIn) {
      setUserPermissionMsg({
        severity: "error",
        msg: "You must be logged in to create a church unit.",
      });
      return;
    }

    setUserPermissionMsg(null);

    const opts = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };

    request("api/Auth/Permissions", opts)
      .then((res) => {
        if (res.result === "success") {
          closeModal();
        } else if (res.result === "notLoggedIn") {
          setUserPermissionMsg({
            severity: "error",
            msg: "You must be logged in to create a church unit.",
          });
        } else {
          setUserPermissionMsg({
            severity: "error",
            msg: "Oops.  There was an error updating the user's permissions.  Please try again",
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
            onChange={verifyValidUser}
            fullWidth
            margin="dense"
            variant="standard"
          />
          <Select
            id="permission"
            labelId="permissionLabel"
            label="Permission"
            defaultValue={"viewPublic"}
            fullWidth
            // onChange={handleChange}
          >
            {Object.keys(VALID_PERMISSIONS).map((perm) => (
              <MenuItem key={perm} value={perm}>
                {VALID_PERMISSIONS[perm]}
              </MenuItem>
            ))}
          </Select>

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
