import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { CiGift } from "react-icons/ci";
import "./header.css";

function Header() {
  return (
    <section className="headerBig ">  
    <Container className="container ">
    <Row >
      <Col className="header">
        {/*left section */}
        <div className="header1">
          <div> PAY BY PHONE:</div>

          <div>4762368326</div>
        </div>

        {/*right section */}
        <div className="header2">
          <Button variant="primary" size="lg" className="perimery">
            <span ><CiGift className="giftIco"/></span>
            <span>Gift Cards</span>
          </Button>{" "}
          <Button variant="secondary" size="lg" className="secon">
            LOGIN
          </Button>
        </div>
      </Col>
    </Row>
  </Container></section>
  
  );
}

export default Header;


