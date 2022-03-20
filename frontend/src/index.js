import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PermissionsContextProvider } from "./store/PermissionsContext";
import Info from "./pages/Info";
import Landing from "./pages/Landing";

window.addEventListener('beforeunload', () => {
  if (!localStorage.getItem('stayLoggedInEmail')) {
    fetch("/api/Auth/LogOut", { method: "DELETE" });
  }
});

const rootElement = document.getElementById("root");

render(
  <PermissionsContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:churchUnit" element={<Info />} />
      </Routes>
    </BrowserRouter>
  </PermissionsContextProvider>,
  rootElement
);