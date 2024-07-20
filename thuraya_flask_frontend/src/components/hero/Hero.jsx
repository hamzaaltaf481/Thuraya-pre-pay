import React from "react";
import "./hero.css";
import heroimage from "./image/main1.png";
import heroImage2 from "./image/bgImageWithoutBg.png";
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero1 container" id="hero111">
        {/*left side */}
        <div className="hero1a">
          <div>
            <h1>Quick, Easy & Secure</h1>
            <p>
              Instant  recharge for your Thuraya  
            </p>
          </div>
        </div>

        {/*right side */}
        <div className="hero1b" >
          <span><img src={heroimage} alt="" className="imageFirst"/></span>
          <span><img src={heroImage2} alt="" width={250} className="useThissImage"/></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
