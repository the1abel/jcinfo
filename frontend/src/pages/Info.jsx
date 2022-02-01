import React, { useState, useEffect } from "react";
import {
  // Button,
  CircularProgress,
} from "@mui/material";
import styles from "./Info.module.css";
import Header from "../components/Header";

export default function Info(props) {
  const [isLoading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');



  return (
    <React.Fragment>
      <Header title={pageTitle} />
      <header className={styles.header}>

      </header>

      <main className={styles.main}>
        {isLoading && <CircularProgress />}
      </main>

    </React.Fragment>
  );
}
