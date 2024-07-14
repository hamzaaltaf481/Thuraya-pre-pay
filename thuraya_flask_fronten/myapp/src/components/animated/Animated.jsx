// import React, { useState } from 'react';
// import "./animated.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import animationData3 from "./animation3.json";
// import animationData4 from "./animation4.json";
// import Lottie from "lottie-react";
// import TopUp from '../TopUp/TopUp';

// const Animated = () => {
//   const [showTopUp, setShowTopUp] = useState(false);
//   const [activeAnimation, setActiveAnimation] = useState(null);

//   const handleAnimationClick = (animationNumber) => {
//     setShowTopUp(true);
//     setActiveAnimation(animationNumber);
//   };

//   const handleTopUpClose = () => {
//     setShowTopUp(false);
//     setActiveAnimation(null);
//   };

//   return (
//     <div className='animated'>
   
//       <Container>
//         {!showTopUp ? (
//           <Row>
//             <Col xs={6} className='animatedcol'>
//               <div className="animation-container"
//                 onClick={() => handleAnimationClick(1)}
//               >
//               <h1 style={{color:"#fff",textAlign:"center",marginBottom:"-50px"}}> Quick Refill </h1>

//                 <Lottie animationData={animationData3} />
//               </div>
//             </Col>
//             <Col xs={6} className='animatedcol'>
//               <div className="animation-container"
//                 onClick={() => handleAnimationClick(2)}
//               >
//               <h1 style={{color:"#fff",textAlign:"center",marginBottom:"-50px"}}>Purchase Units </h1>
//                 <Lottie animationData={animationData4} />
//               </div>
//             </Col>
//           </Row>
//         ) : null}
//         {showTopUp && (
//           <Row>
//             <Col xs={12}>
//               <TopUp onClose={handleTopUpClose} />
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default Animated;


import React, { useState } from 'react';
import "./animated.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import animationData3 from "./animation3.json";
import animationData4 from "./animation4.json";
import Lottie from "lottie-react";
import TopUp from '../TopUp/TopUp';

const Animated = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(null);

  const handleAnimationClick = (animationNumber) => {
    console.log("Animation clicked: ", animationNumber);
    setShowTopUp(true);
    setActiveAnimation(animationNumber);
  };

  const handleTopUpClose = () => {
    setShowTopUp(false);
    setActiveAnimation(null);
  };

  return (
    
    <div className='animated'>
      <Container>
        {!showTopUp ? (
          <Row>
            <Col xs={12} md={6} className='animatedcol'>
              <div
                className="animation-container"
                onClick={() => handleAnimationClick(1)}
              >
                <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "-50px" }}>
                  Quick Refill
                </h1>
                <Lottie animationData={animationData3} />
              </div>
            </Col>
            <Col xs={12} md={6} className='animatedcol'>
              <div
                className="animation-container"
                onClick={() => handleAnimationClick(2)}
              >
                <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "-50px" }}>
                  Purchase Units
                </h1>
                <Lottie animationData={animationData4} />
              </div>
            </Col>
          </Row>
        ) : null}
        {showTopUp && (
          <Row>
            <Col xs={12}>
              <TopUp onClose={handleTopUpClose} />
            </Col>
          </Row>
        )}
      </Container>
      
       
    </div>

   

    
  );
};

export default Animated;
