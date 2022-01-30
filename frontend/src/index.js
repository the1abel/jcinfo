import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Landing from "./pages/Landing";
import Info from "./pages/Info";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<Info />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);