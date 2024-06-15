import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Navbar from "./components/Navbar";
import Forgetpass from "./components/forgetpass/forgetpass";
import LandingPage from "./components/landing-page/landing_page";

import Footer from "./components/footer/footer";
import QuickRefill from "./components/quick-refill/quick_refll";
import RefillUnits from "./components/refill-units/refill_units";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import ConfirmMail from "./components/confrim-mail/confrim_mail";

function App() {
  const token = localStorage.getItem("token");
  return (
    <>
      <Navbar />
      <div className=" overflow-hidden">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/quick_refill" element={<QuickRefill />} />
          <Route exact path="/refill_units" element={<RefillUnits />} />
          <Route
            exact
            path="/login"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forget-pass" element={<Forgetpass />} />
          <Route exact path="/confirm_mail/:token" element={<ConfirmMail />} />
        </Routes>
      </div>
 
      <Footer />
    </>
  );
}

export default App;
