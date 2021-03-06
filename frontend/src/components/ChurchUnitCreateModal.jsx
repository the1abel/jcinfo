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

export default function ChurchUnitCreateModal(props) {
  const permissionsCtx = useContext(PermissionsContext);
  const navigate = useNavigate();

  // verify Church Unit Name is unique
  const verifyUniqueName = async (name, yupTestInfoObj) => {
    if (!name) return false;

    // TODO wait for a pause in user input before fetching
    return await request("/api/ChurchUnit/IsUniqueName/" + encodeURIComponent(name))
      .then((res) => {
        setUrlName(res.urlName);
        return res.result;
      })
      .catch((err) => {
        setCreateError(err.toString());
        return false;
      });
  };

  // form validation schema (yup)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Church unit name must be at least 3 characters")
      .required("Curch unit name is required")
      .test("verifyUniqueName", "A church unit already has that URL.", verifyUniqueName),
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
    reset();
    setUrlName("");
    props.onClose();
  };

  // create new Church Unit
  const handleCreate = (data) => {
    if (!permissionsCtx.isLoggedIn) {
      setCreateError("You must be logged in to create a church unit.");
      return;
    }

    setCreateError(null);

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };

    request("api/ChurchUnit/Create", opts)
      .then((res) => {
        if (res.result === "Success") {
          const newPermissions = structuredClone(permissionsCtx.permissions);
          newPermissions[res.urlName] = { all: "admin" };
          permissionsCtx.setPermissions(newPermissions);

          closeModal();
          navigate("/" + res.urlName);
        } else if (res.result === "ErrorNotLoggedIn") {
          setCreateError("You must be logged in to create a church unit.");
          setTimeout(() => permissionsCtx.setPermissions(null), 3000);
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
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.name?.message && <Alert severity="error">{errors.name?.message}</Alert>}

          <DialogContentText>
            URL: https://www.jcinfo.com/<b>{urlName}</b>
          </DialogContentText>

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
