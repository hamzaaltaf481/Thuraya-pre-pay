import React, { useState } from 'react';
import './RefillUnits.css';
import image from './thuraya.png';

const unitsData = [
  { id: 1, name: '10 units', price: 10 },
  { id: 2, name: '20 units', price: 20 },
  { id: 3, name: '39 units', price: 39 },
  { id: 4, name: '50 units', price: 50 },
  { id: 5, name: '80 units', price: 80 },
  { id: 6, name: '160 units', price: 160 },
  { id: 7, name: '500 units', price: 500 },
  { id: 8, name: '1000 units', price: 1000, outOfStock: true },
  { id: 9, name: '2500 units', price: 2500 }
];

const RefillUnits = () => {
  const [selectedUnits, setSelectedUnits] = useState([]);

  const handleCardClick = (unit) => {
    setSelectedUnits((prevSelected) => {
      if (prevSelected.some((item) => item.id === unit.id)) {
        return prevSelected.filter((item) => item.id !== unit.id);
      } else {
        return [...prevSelected, { ...unit, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedUnits((prevSelected) =>
      prevSelected
        .map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleInputChange = (id, value) => {
    const newQuantity = value.replace(/\D/g, ''); // Remove all non-digit characters
    if (newQuantity === '') {
      handleQuantityChange(id, 0);
    } else {
      handleQuantityChange(id, parseInt(newQuantity));
    }
  };

  const getTotalAmount = () => {
    return selectedUnits.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container refillWalaContainer">
      <div className="units">
        {unitsData.map((unit, index) => (
          <div
            key={unit.id}
            className={`unit-container ${unit.outOfStock ? 'out-of-stock' : ''} ${
              selectedUnits.some((item) => item.id === unit.id) ? 'selected' : ''
            }`}
            onClick={() => !unit.outOfStock && handleCardClick(unit)}
            style={{ width: '30%',height:"118px" ,marginBottom: '20px', marginRight: index % 3 === 2 ? '0' : '10px' }}
          >
            <div style={{padding:"1px",margin:"-4px", width:"180px",height:"105px",position:"relative",left:"5px"}}
              className={`makeRedBorder ${
                selectedUnits.some((item) => item.id === unit.id) ? 'selected-border' : ''
              }`}
            >
              <div className="unit-content" style={{width:"160px",height:"100px"}}>
                <div
                  className={`unit-header ${selectedUnits.some((item) => item.id === unit.id) ? 'selected' : ''}`}
                >
                  <div style={{position:"relative",top:"7px",marginLeft:"5px"}}>
                    <div className="unit-circle">
                      <span className="circleText" style={{position:"relative",top:"10px",fontSize:"20px"}}>{unit.name.split(' ')[0]}</span>
                    </div>
                    <div className="unit-text">UNITS</div>
                  </div>
                  <div className="priceWithThuraya" style={{position:"relative",left:"60px"}}>
                    <span className="unit-price" style={{ fontSize: '20px',position:"relative",top:"-10px",left:"10px"}}>
                      ${unit.price}
                    </span>
                    {/* <div className="unit-logo"><img src={image} width={60} alt="thuraya logo" /></div> */}
                  </div>
                </div>
                {!selectedUnits.some((item) => item.id === unit.id) && (
                  <div className="unit-logo" style={{position:"relative",top:"15px",left:"-7px"}}>
                    <img src={image} width={90} alt="thuraya logo" />
                  </div>
                )}

                {selectedUnits.some((item) => item.id === unit.id) && (
                  <div className="quantity-controls" style={{position:"relative",top:"5px",maxWidth:"10px",height:"20px",left:"-80px"}}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                          unit.id,
                          selectedUnits.find((item) => item.id === unit.id).quantity - 1
                        );
                      }}
                      disabled={selectedUnits.find((item) => item.id === unit.id).quantity <= 1}
                    style={{fontSize:"26px"}}>
                      -
                    </button>
                    <input
                      type="text"
                      value={selectedUnits.find((item) => item.id === unit.id).quantity.toString()}
                      onChange={(e) => handleInputChange(unit.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.target.select()} // Selects all text when input field is focused
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                          unit.id,
                          selectedUnits.find((item) => item.id === unit.id).quantity + 1
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ color: '#fff' , fontSize:"20px",textDecoration:"underline"}}>Summary:</h2>
      <div className="summary" style={{width:"400px",background:"none",border:"none"}}>
        {selectedUnits.map((item) => (
          <div key={item.id} className="summary-item" style={{borderBottom:"1px solid #fff"}}>
            <span>{item.name}</span>
            <span>Quantity: {item.quantity}</span>
            <span>Amount: ${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="total">
          <span>Total</span>
          <span>${getTotalAmount()}</span>
        </div>
      </div>
      <button className="proceed-button" style={{ marginTop: '20px' }}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default RefillUnits;
