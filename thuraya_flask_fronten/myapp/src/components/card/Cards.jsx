import React from 'react'
import "./card.css"
import { TbHandClick } from "react-icons/tb";
import { IoIosPhonePortrait } from "react-icons/io";
import { TbMessage2Code } from "react-icons/tb";



const Cards = () => {
  return (
    <section className='card' id='card2' >
    
    
    <div className='container fluid card1' style={{paddingBottom:"20px"}}>
    
    <h1>How it works in 4 easy steps ?</h1>

    <div className='cardcontainer'>
    
  

    <div className='cardcontainer1'>
      
    <div className='iconhand'>

    <TbHandClick className='iconchild'/>

    </div>

    <div className='cat1 cat2'>Step 1 </div>

    <div className='cat1' id='cat1' style={{marginTop:"10px", paddingBottom:"10px"}}>
    <h5>Choose a carrier</h5>
    <p>Lorem Ipsum is simply <br></br> dummy text of </p>
    </div>

 </div>

 <div className='cardcontainer1'>
      
 <div className='iconhand'>

 <TbMessage2Code className='iconchild'/>

 </div>

 <div className='cat1 cat2'>Step 2 </div>

 <div className='cat1' id='cat1' style={{marginTop:"10px", paddingBottom:"10px"}}>
 <h5>Enter Your Number</h5>
 <p>Lorem Ipsum is simply <br></br> dummy text of </p>
 </div>

</div>

<div className='cardcontainer1'>
      
<div className='iconhand'>

<IoIosPhonePortrait className='iconchild'/>

</div>

<div className='cat1 cat2'>Step 3 </div>

<div className='cat1' id='cat1' style={{marginTop:"10px", paddingBottom:"10px"}}>
<h5>Select A Plan</h5>
<p>Lorem Ipsum is simply <br></br> dummy text of </p>
</div>

</div>

<div className='cardcontainer1'>
      
<div className='iconhand'>

<IoIosPhonePortrait className='iconchild'/>

</div>

<div className='cat1 cat2'>Step 4 </div>

<div className='cat1' id='cat1' style={{marginTop:"10px", paddingBottom:"10px"}}>
<h5>Pay</h5>
<p>Lorem Ipsum is simply <br></br> dummy text of </p>
</div>

</div>
    

    </div>

    </div>

    </section>

   
  )
}

export default Cards
