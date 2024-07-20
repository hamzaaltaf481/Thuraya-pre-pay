import "./App.css";
import { useState } from "react";
import Admin from "./components/admin/Admin";
import Admin_cards from "./components/admin/Admin_cards";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Routes, Route, useLocation } from "react-router-dom";
import New from "./New";
import Navbar from "./components/Navbar";
import Login from "./components/login/Login";
import Signup from "./components//signup/Signup";
import Forgetpass from "./components/forgetpass/forgetpass";
import ConfirmMail from "./components/confrim-mail/confrim_mail";
import Footer from "./components/footer_old/footer";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  let userRole = null;
  if (token && typeof token === "string") {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded?.user_role;
    } catch (error) {
      console.error("Invalid token specified:", error);
    }
  }
  console.log("user role", userRole);
  return (
    <>
      <Routes>
        <>
          <Route exact path="/" element={<New />} />
        </>
      </Routes>
      {location.pathname !== "/" && <Navbar />}{" "}
      <div className=" overflow-hidden">
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forget-pass" element={<Forgetpass />} />
          <Route exact path="/confirm_email/:token" element={<ConfirmMail />} />
          {/* {userRole === "admin" && token && ( */}
          <>
            <Route
              path="/admin"
              element={<Admin setData={setData} data={data} />}
            />
            <Route
              path="/admin_card/:index"
              element={<Admin_cards data={data} />}
            />
          </>
          {/* )} */}
        </Routes>
      </div>
      {location.pathname !== "/" && <Footer />}{" "}
    </>
  );
}

export default App;
