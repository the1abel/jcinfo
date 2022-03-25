import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PermissionsContextProvider } from "./store/PermissionsContext";
import Colors from "./pages/Colors";
import ChurchUnit from "./pages/ChurchUnit";
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
        <Route path="/colors" element={<Colors />} />
        <Route path="/:churchUnit" element={<ChurchUnit />} />
      </Routes>
    </BrowserRouter>
  </PermissionsContextProvider>,
  rootElement
);