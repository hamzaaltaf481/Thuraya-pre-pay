import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./features.css";
import image from "./image/faetureImage.png";

function Features() {
  return (
    <section className="feature">
      <Container className="fluid feature1">
        <Row className="cardoo1">
          <Col xs={6} className="firstCol">
            <div className="feature1a">
              <h1>
                Benefits of <span className="cellpay">Thurayapay</span>
              </h1>
            </div>

            {/* 1st description */}
            <div className="feature1b">
              <div>
                <h1>01</h1>
              </div>

              <div className="feature1ba">
                <h4>Fast and convenient</h4>
                <p>
                  We guarantee 100% satisfaction for every <br />
                  transaction
                </p>
              </div>
            </div>

            <div className="feature1b">
              <div>
                <h1>02</h1>
              </div>

              <div className="feature1ba">
                <h4>Fast and convenient</h4>
                <p>
                  We guarantee 100% satisfaction for every <br />
                  transaction
                </p>
              </div>
            </div>

            <div className="feature1b">
              <div>
                <h1>03</h1>
              </div>

              <div className="feature1ba">
                <h4>Fast and convenient</h4>
                <p>
                  We guarantee 100% satisfaction for every <br />
                  transaction
                </p>
              </div>
            </div>
          </Col>

          <Col xs={6} className="secondCall" >
            <div className="imageWali">
              <img src={image} height={500}  className="imagewaliresp" />
            </div>

            {/*<div className="color1">
            
            </div>

            <div className="ferozoColor">
            
            </div>


            <div className="hori">

            <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            </div>

          
            <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            </div>
            <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            </div>
            <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            </div>
            <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            </div>
          


            </div>
             */}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Features;
