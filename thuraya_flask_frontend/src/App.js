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
import { useEffect, useState } from "react";
import ConfirmMail from "./components/confrim-mail/confrim_mail";
import Admin from "./components/admin/Admin";
import Admin_cards from "./components/admin/Admin_cards";
import AdminCard from "./components/admin/Admin_cards";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <div className=" overflow-hidden">
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route exact path="/quick_refill" element={<QuickRefill />} />
          <Route exact path="/refill_units" element={<RefillUnits />} />
          <Route
            exact
            path="/login"
            element={token ? <Navigate to="/Login" /> : <Login />}
          />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forget-pass" element={<Forgetpass />} />
          <Route exact path="/confirm_email/:token" element={<ConfirmMail />} />
        </Routes>
      </div>
      {/* <Routes>
      <Route path="/" element={<Admin setData={setData} data={data} />} />
      <Route path="/admin_card/:index" element={<Admin_cards data={data} />} />
      </Routes> */}
      <Footer className="" />
    </>
  );
}

export default App;
