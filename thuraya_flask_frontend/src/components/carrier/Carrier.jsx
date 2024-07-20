import React from "react";
import "./carrier.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import atpaid from "./images1/at prepaid.png";
import mble1 from "./images1/sinplemobile.png";
import total from "./images1/totalwirelss.png";
import boostmobile from "./images1/boostmobile.png";
import cricketwireless from "./images1/cricketwirelsss.jpg";
import h20wirelss from "./images1/h20wireless.png";
import cell from "./images1/uscellualr.png";
import lyca from "./images1/lycamobile.png";
import pocket from "./images1/redpocket.jpeg";
import metro from "./images1/metropcs.png";
import page from "./images1/pagepluslogo.png";
import net10 from "./images1/net10wireless.png";

function Carrier() {
  return (
    <section className="carrier">
      {" "}
      <Container className="fluid carrier1 sm" id="carrier11">
      <h2 className="choosecarrier" >
      
      Choose A Carrier </h2>
      <div className="cro1">   
        <Row>
          <Col  className="cat">

          <div className="caro column">
          <img src={atpaid}/>
          </div>
          
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={boostmobile} height={93}/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={cricketwireless} height={94}/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={h20wirelss} height={94}/>
          </div>
          </Col>
        </Row>
        <Row>
          <Col  className="cat">
          <div className="caro">
          <img src={lyca} className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={metro}className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={net10}className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={page}className="lyca"/>
          </div>
          </Col>
        </Row>
        <Row>
          <Col  className="cat">
          <div className="caro">
          <img src={pocket}className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={mble1}className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={total}className="lyca"/>
          </div>
          </Col>
          <Col className="cat">
          <div className="caro">
          <img src={cell}className="lyca"/>
          </div>
          </Col>
        </Row>
        </div>
        
      </Container>
      
    </section>
  );
}

export default Carrier;
