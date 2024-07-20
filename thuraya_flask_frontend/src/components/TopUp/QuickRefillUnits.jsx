

import React, { useState } from 'react';
import './QuickRefillUnits.css';
import image from "./thuraya.png";

const unitOptions = [
  { units: 10, price: 10 },
  { units: 20, price: 20 },
  { units: 39, price: 39 },
  { units: 50, price: 50 },
  { units: 80, price: 80 },
  { units: 160, price: 160 },
  { units: 500, price: 500 },
  { units: 1000, price: 1000 },
  { units: 2500, price: 2500 },
];

function QuickRefillUnits() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneNumberChange = (e) => {
    let inputNumber = e.target.value;
    // Only allow digits
    inputNumber = inputNumber.replace(/\D/g, '');
    // Limit to maximum 10 digits
    const finalNumber = inputNumber.slice(0, 10);

    // Update state with formatted number
    setPhoneNumber(finalNumber);
    // Clear error message when valid number is entered
    setPhoneNumberError('');
  };

  const handlePhoneNumberSubmit = (e) => {
    e.preventDefault();
    // Validate the full format including the exact length and digits after prefix
    if (phoneNumber.length !== 10) {
      setPhoneNumberError('Invalid phone number. It should be exactly 10 digits.');
    }
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="App quickRefillMain">
      <h2 style={{color:"#fff",marginLeft:"10px",fontSize:"17px",wordSpacing:"4px",letterSpacing:"1px"}}>Quick Refill Your Account</h2>
      <form onSubmit={handlePhoneNumberSubmit} style={{marginTop:"20px",width:"300px"}}>
        <div className="phone-input">
          <span style={{color:"black",backgroundColor:"#fff",width:"50px",height:"59px",textAlign:"center",zIndex:"1",position:"relative",right:"-10px",borderTopLeftRadius:"1px",borderBottomLeftRadius:"1px"}}><h5 style={{position:"relative",top:"18px",fontSize:"18px"}}>+882</h5></span>
          <input
            type="text"
            className="input-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="xxxxxxxxxx"
           style={{border:"none",outline:"none"}}
          />
        </div>
        {phoneNumberError && <p className="error-message">{phoneNumberError}</p>}
      </form>

      {phoneNumber.length === 10 && (
        <div>
          <div className="units-grid">
            {unitOptions.map((option, index) => (
              <div
                key={index}
                className={`unit-card ${selectedUnit === option ? 'selected' : ''}`}
                onClick={() => handleUnitSelect(option)}
              >


                <div className='tryIt'>
                <div className='adjustQuickRefillCards'>

                <div>
                <div className='circleQuick'><h5 style={{position:"relative",top:"13px",fontSize:"20px"}}>{option.units}</h5></div>
                <div>UNITS</div>
                </div>

                <div className='priceOfQuickRefill ' style={{position:"relative",top:"10px"}}>
                <p style={{position:'relative',left:"20px"}}>${option.price.toFixed(2)}</p>
                <img src={image} width={70} style={{position:"relative",left:"15px"}}/>
                </div>

                
                </div></div>



              </div>
            ))}
          </div>

          {selectedUnit && (
            <div className="summary-section" >
              <div className="summary" style={{background:"none",border:"none",color:"#fff"}}>
                <h3 style={{fontSize:"20px",textDecoration:"underline"}}>Summary :</h3>
                <ul>
                  <li className='quickRefillBelowSummary'>Units: {selectedUnit.units}</li>
                  <li className='quickRefillBelowSummary'>Price: ${selectedUnit.price.toFixed(2)}</li>
                </ul>
                <p className="total">Total: ${selectedUnit.price.toFixed(2)}</p>
              </div>
              <button className="btn-proceed" style={{marginTop:"20px",marginLeft:"10px"}}  >Proceed to Payment</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuickRefillUnits;
