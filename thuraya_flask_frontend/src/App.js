
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Navbar from "./components/Navbar";
import Footer from "./Footer";
import LandingPage from "./components/landing-page/landing_page";
function App() {
  return (
    // App.js

    <>
      <Navbar />
      <div className=" overflow-hidden">
        <Routes>
        <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/Signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
