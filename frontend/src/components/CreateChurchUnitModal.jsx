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
  TextField,
} from "@mui/material";
import { request } from "../utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

export default function CreateChurchUnitModal(props) {
  const navigate = useNavigate();
  const permissionsCtx = useContext(PermissionsContext);

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Church unit name must be at least 3 characters")
      .required("Curch unit name is required"),
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

  const [createError, setCreateError] = useState(null);
  const [urlName, setUrlName] = useState("");

  const closeModal = () => {
    setCreateError(null);
    setIsUniqueName(true);
    reset();
    setUrlName("");
    props.onClose();
  };

  // Church Unit Name is unique
  const [isUniqueName, setIsUniqueName] = useState(true);
  const handleNameChange = (ev) => {
    // TODO wait for a pause in user input before fetching
    request("/api/ChurchUnit/IsUniqueName/" + encodeURIComponent(ev.target.value))
      .then((res) => {
        setIsUniqueName(res.result);
        setUrlName(res.urlName);
      })
      .catch((err) => setCreateError(err.toString()));
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

    request("api/ChurchUnit/Create", opts)
      .then((res) => {
        if (res.result === "success") {
          closeModal();
          navigate("/" + res.urlName);
        } else if (res.result === "notLoggedIn") {
          setCreateError("You must be logged in to create a church unit.");
        } else {
          setCreateError(
            "Oops.  There was an error creating your church unit.  Please try again"
          );
        }
      })
      .catch((err) => setCreateError(err.toString()));
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
