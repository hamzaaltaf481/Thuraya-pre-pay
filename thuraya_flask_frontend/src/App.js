import { BrowserRouter as Router, Route, Routes , Navigate} from "react-router-dom";
import "./App.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Navbar from "./components/Navbar";

import LandingPage from "./components/landing-page/landing_page";
 // Fixed typo in component import
import Footer from "./components/footer/footer";
import QuickRefill from "./components/quick-refill/quick_refll";
import RefillUnits from "./components/refill-units/refill-units";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";

function App() {
 
const token = localStorage.getItem('token') 
  return (
    <>
      <Navbar />
      <div className=" overflow-hidden">
        <Routes>
          {/* <Route exact path="/" element={ token? <LandingPage /> : <Navigate to="/login" />} /> */}
            <Route exact path="/" element={<LandingPage/>} /> 
          <Route exact path="/quick_refill" element={<QuickRefill/>} />
          <Route exact path="/refill_units" element={<RefillUnits />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} /> // Changed "/Signup" to "/signup" to match the route
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
