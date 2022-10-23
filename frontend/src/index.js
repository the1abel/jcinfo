import ChurchUnit from "./pages/ChurchUnit";
import Colors from "./pages/Colors";
import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PermissionsContextProvider } from "./store/PermissionsContext";
import { render } from "react-dom";

const lastLocation = localStorage.getItem("lastLocation");
if (lastLocation && window.location.href.slice(0, -1) === window.location.origin) {
  window.location.href = window.location.origin + lastLocation;
}

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
        <Route path="/colors" element={<Colors />} />
        <Route path="/:churchUnitUrlName" element={<ChurchUnit />} />
        <Route path="/:churchUnitUrlName/UpdateEvent/:eventId" element={<ChurchUnit />} />
      </Routes>
    </BrowserRouter>
  </PermissionsContextProvider>,
  rootElement
);