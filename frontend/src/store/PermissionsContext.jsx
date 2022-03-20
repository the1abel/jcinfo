import React, { useEffect, useState } from "react";

const PermissionsContext = React.createContext({
  permissions: null, // default value
  isLoggedIn: false,
  setPermissions: (permissions) => {}, // dummy function for IDE autocompletion
});

export const PermissionsContextProvider = (props) => {
  const [permissions, setPermissions] = useState(null);
  const handleSetPermissions = (permissions) => {
    if (permissions) {
      setPermissions(permissions);

      for (const form of document.forms) {
        if (form.stayLoggedIn?.checked) {
          localStorage.setItem("stayLoggedInEmail", form.email.value);

        } else if (form.stayLoggedIn) {
          // stayLoggedIn checkbox exists but is not checked
          localStorage.removeItem("stayLoggedInEmail");
        }
      }
    } else {
      setPermissions(null);
      localStorage.removeItem("stayLoggedInEmail");
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("stayLoggedInEmail");
    if (email) {
      fetch("/api/Auth/Permissions?email=" + email)
        .then((resStream) => resStream.json())
        .then((res) => {
          if (res.result === "success") {
            setPermissions(res.permissions);
          } else {
            setPermissions(null);
            localStorage.removeItem("stayLoggedInEmail");
          }
        });
    }
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isLoggedIn: !!permissions,
        setPermissions: handleSetPermissions,
      }}
    >
      {props.children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
