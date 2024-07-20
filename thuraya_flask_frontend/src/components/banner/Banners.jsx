import React from 'react'
import "./banner.css"
import image from "./image/image.png";

const Banners = () => {
  return (
    <section className='banner'>
     <div className='container-fluid banner1'>
     {/*left side*/}
     <div className='banner1a'>
       <div style={{marginBottom:"20px"}}><h4 className='bannertext'>Did not receive your payment?</h4></div>
       <div><h4 className='bannertext'>Unsubscribe from autopay</h4></div>
     </div>

     {/*right side*/}
     <div className='banner1b'>
     <img src={image} className='bannerimage'/>
     </div>
     </div>
    </section>
  )
}

export default Banners
