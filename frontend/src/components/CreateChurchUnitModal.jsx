import PermissionsContext from "../store/PermissionsContext";
import React, { useContext, useState } from "react";
import styles from "./auth.module.css";
import * as Yup from "yup";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function CreateChurchUnitModal(props) {
  const permissionsCtx = useContext(PermissionsContext);

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Curch unit name is required"),
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

  const [createError, setCreateError] = useState(null);
  const [urlName, setUrlName] = useState("");

  const closeModal = () => {
    reset();
    setUrlName("");
    props.onClose();
  };

  // email is unique
  const [isUniqueName, setIsUniqueName] = useState(true);
  const handleNameChange = (ev) => {
    // TODO wait for a pause in user input before fetching
    fetch("/api/ChurchUnit/IsUniqueName?name=" + encodeURIComponent(ev.target.value))
      .then((resStream) => resStream.json())
      .then((res) => {
        console.log('res.result', res.result); // DEBUG
        setIsUniqueName(res.result);
        setUrlName(res.urlName);
      })
      .catch((err) => setCreateError(err));
  };

  // create new Church Unit
  const handleCreate = (data) => {
    if (!permissionsCtx.isLoggedIn) {
      setCreateError("You must be logged in to create a church unit.");
      return;
    }

    setCreateError(null);
    if (!isUniqueName) {
      return;
    }

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };

    fetch("api/ChurchUnit/Create", opts)
      .then((resStream) => resStream.json())
      .then((res) => {
        if (res.result === "success") {
          closeModal();
          // TODO redirect to new unit page
        } else {
          setCreateError(
            "Oops.  There was an error creating your church unit.  Please try again"
          );
        }
      })
      .catch((err) => setCreateError(err));
  };

  return (
    <Dialog open={props.isOpen} onClose={closeModal}>
      <form
        name="createChurchUnit"
        onSubmit={handleSubmit(handleCreate)}
        noValidate
        className={styles.form}
      >
        <DialogTitle>Create a Church Unit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Name of the new Church Unit"
            {...register("name")}
            type="text"
            onChange={handleNameChange}
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.name?.message && <Alert severity="error">{errors.name?.message}</Alert>}

          <DialogContentText>
            URL: https://www.jcinfo.com/<b>{urlName}</b>
          </DialogContentText>
          {!isUniqueName && (
            <Alert severity="error">A Church Unit already has that URL.</Alert>
          )}

          {createError && <Alert severity="error">{createError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Create
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
