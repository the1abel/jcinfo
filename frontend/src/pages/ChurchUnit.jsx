import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import styles from "./ChurchUnit.module.css";
import { useParams } from "react-router-dom";
import {
  // Button,
  CircularProgress,
} from "@mui/material";

export default function ChurchUnit(props) {
  const { churchUnit } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const info = {
      urlName: "ranchocaliforniaward",
      name: "Rancho California Ward",
      events: [
        {
          title: "Sacrament Meeting",
          dateStart: "",
        },
      ],
    };

    setPageTitle(info.name);
    setIsLoading(false);
  }, []);

  return (
    <React.Fragment>
      <Header title={pageTitle} />

      <main className={styles.main}>{isLoading && <CircularProgress />}</main>
    </React.Fragment>
  );
}
