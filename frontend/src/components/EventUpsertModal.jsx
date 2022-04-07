import React, { useEffect, useState } from "react";
import styles from "./EventUpsertModal.module.css";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { request } from "../utils";
import { OpenInNew } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";

export default function EventUpsertModal(props) {
  const { event, isOpen, unitOrgs } = props;

  // form validation schema (yup)
  const orgsErrMsg = "At least one organization must be selected";
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    orgs: Yup.array().min(1, orgsErrMsg).typeError(orgsErrMsg),
    start: Yup.string().required("Start date is required"),
    finish: Yup.string().required("Finish date is required"),
  });

  // form validation (react-hook-form)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [error, setError] = useState(null);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [isForMembersOnly, setIsForMembersOnly] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [doDisplayTime, setDoDisplayTime] = useState(true);

  useEffect(() => {
    if (event?.id) {
      const dtLength = !event.isAnnouncement && event.doDisplayTime ? 16 : 10;

      setValue("title", event.title);
      setValue("headline", event.headline);
      setIsForMembersOnly(event.isForMembersOnly);
      setSelectedOrgs(event.orgs);
      setValue("orgs", event.orgs);
      setIsAnnouncement(event.isAnnouncement);
      setDoDisplayTime(event.doDisplayTime);
      setValue("start", event.start && event.start.substring(0, dtLength));
      setValue("finish", event.finish && event.finish.substring(0, dtLength));
      setValue("publicDescription", event.publicDescription);
      setValue("membersOnlyDescription", event.membersOnlyDescription);
      setValue("location", event.location);
    }
  }, [event, isOpen, setValue]);

  useEffect(() => {
    if (event?.id) {
      const dtLength = !isAnnouncement && doDisplayTime ? 16 : 10;

      setValue("start", event.start && event.start.substring(0, dtLength));
      setValue("finish", event.finish && event.finish.substring(0, dtLength));
    }
  }, [event, doDisplayTime, isAnnouncement, setValue]);

  const closeModal = () => {
    setError(null);
    reset();
    props.onClose();
  };

  const handleChangeOrgs = (ev) => {
    const value = ev.target.value;
    setSelectedOrgs(typeof value === "string" ? value.split(",") : value);
  };

  // sign up
  const handleSave = (newEvent) => {
    setError(null);
    if (event.id) newEvent.id = event.id;

    const opts = {
      method: event.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent, null, 2),
    };

    request(`/api/ChurchUnit/${window.location.pathname.slice(1)}/Event`, opts)
      .then((res) => {
        if (res.result === "Success") {
          if (event.id) {
            props.onEditEvent(newEvent);
          } else {
            newEvent.id = res.id;
            props.onAddEvent(newEvent);
          }
          closeModal();
        } else {
          setError(
            "An unspecified error occurred.  Please try again.  " +
              "If the problem persists, please contact us at abelw@live.com"
          );
        }
      })
      .catch((err) => setError(err.toString()));
  };

  const ejectToNewWindow = () => {
    const url = window.location.href + "/UpdateEvent/" + event.id;

    // create a global object to retain references to pop-out windows
    if (!window.popOutWindows) window.popOutWindows = {};

    const form = document.forms.event;
    window.popOutWindows[event.id] = window.open(
      url,
      event.id,
      `left=10, top=10, width=${form.clientWidth}, height=${form.clientHeight}`
    );
    closeModal();
  };

  return (
    <Dialog open={props.isOpen} onClose={closeModal}>
      <form
        name="event"
        onSubmit={handleSubmit(handleSave)}
        noValidate
        className={styles.form}
        onClick={(ev) => ev.stopPropagation()}
      >
        <DialogTitle>
          {event.id ? "Edit Event" : "Create Event"}
          <Button onClick={ejectToNewWindow}>
            <OpenInNew />
          </Button>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="title"
            label="Title"
            {...register("title")}
            type="text"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.title?.message && (
            <Alert severity="error">{errors.title?.message}</Alert>
          )}

          <TextField
            id="headline"
            label="Headline"
            {...register("headline")}
            type="text"
            fullWidth
            margin="dense"
            variant="standard"
          />
          {errors.headline?.message && (
            <Alert severity="error">{errors.headline?.message}</Alert>
          )}

          <FormControlLabel
            id="isForMembersOnly"
            name="isForMembersOnly"
            label="Hide from people who are not subscribed or not logged in."
            {...register("isForMembersOnly")}
            control={
              <Checkbox
                checked={isForMembersOnly}
                onChange={() => setIsForMembersOnly(!isForMembersOnly)}
              />
            }
          />

          {/* Organizations */}
          <div>
            <FormControl className={styles.orgSelector}>
              <InputLabel id="selectedOrgsLabel">Organizations</InputLabel>
              <Select
                id="selectedOrgs"
                labelId="selectedOrgsLabel"
                multiple
                value={selectedOrgs}
                onChange={handleChangeOrgs}
                input={
                  <OutlinedInput id="orgs" label="Organizations" {...register("orgs")} />
                }
                renderValue={(selected) => (
                  <Box className={styles.box}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {Object.keys(unitOrgs).map(
                  (org) =>
                    org !== "top" && (
                      <MenuItem key={org} value={org}>
                        {org}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </div>
          {errors.orgs?.message && <Alert severity="error">{errors.orgs?.message}</Alert>}

          <FormControlLabel
            id="isAnnouncement"
            name="isAnnouncement"
            label="This is an Announcement (not an Event)."
            {...register("isAnnouncement")}
            control={
              <Checkbox
                checked={isAnnouncement}
                onChange={() => setIsAnnouncement(!isAnnouncement)}
              />
            }
          />
          {isAnnouncement && (
            <Alert severity="info">
              <b>• Start Date:</b> the position (sort order) in the list of Events.
              <br />
              <b>• Finish Date:</b> the last day the announcement will be shown.
            </Alert>
          )}

          <div className={isAnnouncement ? styles.hidden : ""}>
            <FormControlLabel
              id="doDisplayTime"
              name="doDisplayTime"
              label="Display the times (not just dates)."
              {...register("doDisplayTime")}
              control={
                <Checkbox
                  checked={doDisplayTime}
                  onChange={() => setDoDisplayTime(!doDisplayTime)}
                />
              }
            />
          </div>

          {/* date-times */}
          <div className={styles.start}>
            {isAnnouncement || !doDisplayTime ? (
              <React.Fragment>
                <TextField
                  id="start"
                  label="Start Date"
                  {...register("start")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <span className={styles.dateTimeSpacer}></span>
                <TextField
                  id="finish"
                  label="Finish Date"
                  {...register("finish")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TextField
                  id="start"
                  label="Start Date & Time"
                  {...register("start")}
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min
                />
                <span className={styles.dateTimeSpacer}></span>
                <TextField
                  id="finish"
                  label="Finish Date & Time"
                  {...register("finish")}
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min
                />
              </React.Fragment>
            )}
          </div>
          {(errors.start?.message || errors.finish?.message) && (
            <Alert severity="error">
              {errors.start?.message || errors.finish?.message}
            </Alert>
          )}

          {/* descriptions */}
          <TextField
            id="publicDescription"
            label="Public Description"
            {...register("publicDescription")}
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            multiline={true}
          />

          <TextField
            id="membersOnlyDescription"
            label="Subscribers-only Description (hidden if not subscribed or not logged in)"
            {...register("membersOnlyDescription")}
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            multiline={true}
          />

          <TextField
            id="location"
            label="Location"
            {...register("location")}
            type="text"
            fullWidth
            margin="dense"
            variant="standard"
          />

          {error && <Alert severity="error">{error}</Alert>}
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
