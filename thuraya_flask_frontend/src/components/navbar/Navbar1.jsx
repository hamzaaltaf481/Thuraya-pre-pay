import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navbar1.css";
// import logo from "./image/logo.png";
import { TiThMenu } from "react-icons/ti";
import { FaRegWindowClose } from "react-icons/fa";
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from "react";
import image1 from "./image/image1.png";
import { FaLanguage } from "react-icons/fa";



function Navbar1() {
  const [isOpen,setIsopen] = useState(false);
  
  function handleClick(){
     setIsopen(!isOpen);
  }

  const navbarRef = useRef(null);

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNavbar = () => {
    setIsopen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      // Click outside the navbar
      setIsopen(false);
    }
  };
  return (
    <section>
    <Navbar expand="lg" className="bg-body-tertiary navbar1" ref={navbarRef}>
    <Container className="navbar1a container">
      <div>
        <Navbar.Brand href="#home" style={{width:"fit-content"}} className="logo_image">
        <img src={image1} style={{width:"100%", maxWidth:"200px"}} className="logo_image"/>
        </Navbar.Brand>
      </div>

      <div className="navbar1b" >
        {" "}
        <Navbar.Collapse id={isOpen ? "responsive-navbar-nav" : "mystyle"}>
          <Nav className="linksOfNav">
            <a href="#deets" className="domestic">About us</a>
            <a href="#deets">Contact us</a>
            <a href="#deets">Login</a>
            <a href="#deets" ><FaLanguage  className="languageicon"/>
            </a>

          


          </Nav>

     
          
        </Navbar.Collapse>

        
   
        </div>
        <div className="navbar-toggle" onClick={toggleNavbar}>

        <TiThMenu className="hamberger" onClick={handleClick}/>
      </div>
   
    </Container>
  </Navbar></section>
    
  );
}

export default Navbar1;
