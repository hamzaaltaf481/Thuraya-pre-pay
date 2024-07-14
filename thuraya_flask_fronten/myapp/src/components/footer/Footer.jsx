import React from 'react'
import "./footer.css";
import image from "./image/image1.png";
import { MdOutlineDoubleArrow } from "react-icons/md";


const Footer = () => {
  return (
    <footer>
    <div className='container fluid footercontainer'>
    {/*for description*/}
    <div className='footercontainer1'>
    
     <div className='footercontainer1a'>
     <img src={image} width={250} style={{marginBottom:"20px"}}  className='footerLogoImage'/>
     <p className='publish'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content</p>
     </div>

     <div style={{display:'flex'}} id='fotoo'> 
     <div className='footercontainer1b' style={{marginLeft:"90px"}}>
     <h3>Policy</h3>
     <a href='#'> <span className='commonArrows'>&nbsp;&nbsp; </span> <MdOutlineDoubleArrow className='smallDoubleArrow'/>&nbsp;
      DMCA Clients</a>
     <a href='#'> <span className='commonArrows'> &nbsp;&nbsp;&nbsp; </span><MdOutlineDoubleArrow className='smallDoubleArrow'/>&nbsp;
      Privacy Policy</a>
     <a href='#'> <span className='commonArrows'> &nbsp;&nbsp;&nbsp; </span><MdOutlineDoubleArrow className='smallDoubleArrow'/>&nbsp;
     Returns $ refunds <span>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>policy</a>
     <a href='#'> <span className='commonArrows'> &nbsp;&nbsp;&nbsp; </span><MdOutlineDoubleArrow className='smallDoubleArrow'/>&nbsp;
      Terms and conditions</a>
     </div>

     <div className='footercontainer1b'>
     <h3>Help & FAQ</h3>
     <a href='#'><span  className='footerCommon'> &nbsp; &nbsp; &nbsp;</span><MdOutlineDoubleArrow className='smallArrow'/> <span className='footerCommon'>&nbsp; </span>
     About us</a>
     <a href='#'><span className='footerCommon'> &nbsp; &nbsp; &nbsp;</span><MdOutlineDoubleArrow className='smallArrow'/><span className='footerCommon'> &nbsp; </span>
     How to use</a>
     <a href='#'><span className='footerCommon'> &nbsp; &nbsp; &nbsp;</span><MdOutlineDoubleArrow className='smallArrow'/> <span className='footerCommon'>&nbsp;</span> 
     Contact Us</a>
     <a href='#'> <span className='footerCommon'>&nbsp; &nbsp; &nbsp;</span><MdOutlineDoubleArrow className='smallArrow'/> <span className='footerCommon'>&nbsp;</span> 
     Login</a>
     </div>
     </div>


    </div>

    


  </div>

    </footer>
  )
}

export default Footer
