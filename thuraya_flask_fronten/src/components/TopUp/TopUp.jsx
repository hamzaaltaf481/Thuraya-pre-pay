import React, { useState } from 'react';
import QuickRefillUnits from './QuickRefillUnits';
import RefillUnits from './RefillUnits';
import { RxCross2 } from "react-icons/rx";

import './TopUp.css';

const TopUp = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [activeColor, setActiveColor] = useState('openColor');

  return (
    <div className="tabs-container topUpMain">
      <button className="close-button" onClick={onClose}>
        <RxCross2 />
      </button>
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'quick' ? 'active' : 'grayishColor'}`}
          onClick={() => setActiveTab('quick')}
        >
          <h1>Quick Refill Section</h1>
        </div>
        <div
          className={`tab ${activeTab === 'refill' ? 'active' : 'grayishColor'}`}
          onClick={() => setActiveTab('refill')}
        >
          <h1>Refill Section</h1>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === 'quick' && <QuickRefillUnits />}
        {activeTab === 'refill' && <RefillUnits />}
      </div>
    </div>
  );
};

export default TopUp;
