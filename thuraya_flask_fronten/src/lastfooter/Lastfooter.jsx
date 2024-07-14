import React from 'react'
import "./lastfooter.css";

const Lastfooter = () => {
  return (
    <div className='lastfooter'>
    <div>   
      <p>
       <span style={{color:"#fff",marginRight:"10px"}}>&#169;</span>
        {new Date().getFullYear()} Thurayapay All Rights Reserved
      </p>
      </div>
      <div>
      <p> <b> <a href='https://epatronus.com/' target='blank' className='ePatronus'>by ePatronus</a></b>  </p>
      </div>
    </div>
   
  )
}

export default Lastfooter
