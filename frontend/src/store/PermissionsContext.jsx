import React, { useEffect, useState } from "react";
import { request } from "../utils";

const PermissionsContext = React.createContext({
  isLoggedIn: false,
  loggedInUser: null,
  permissions: null, // default value
  setPermissions: (permissions) => {}, // dummy function for IDE autocompletion
});

export const PermissionsContextProvider = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [permissions, setPermissions] = useState(null);
  const handleSetPermissions = (permissions) => {
    if (permissions) {
      setPermissions(permissions);

      for (const form of document.forms) {
        if (form.stayLoggedIn?.checked) {
          localStorage.setItem("stayLoggedInEmail", form.email.value);
          setLoggedInUser(form.email.value);
        } else if (form.stayLoggedIn) {
          // stayLoggedIn checkbox exists but is not checked
          localStorage.removeItem("stayLoggedInEmail");
          setLoggedInUser(form.email.value);
        }
      }
    } else {
      setLoggedInUser(null);
      setPermissions(null);
      localStorage.removeItem("stayLoggedInEmail");
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("stayLoggedInEmail");
    if (email) {
      request("/api/Auth/Permissions?email=" + email)
        .then((res) => {
          if (res.result === "Success") {
            setLoggedInUser(email);
            setPermissions(res.permissions);
          } else {
            setLoggedInUser(null);
            setPermissions(null);
            localStorage.removeItem("stayLoggedInEmail");
          }
        });
    }
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        isLoggedIn: !!permissions,
        loggedInUser: loggedInUser,
        permissions: permissions,
        setPermissions: handleSetPermissions,
      }}
    >
      {props.children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
