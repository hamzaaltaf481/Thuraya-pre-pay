import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Navbar1 from "./components/navbar/Navbar1";
import Hero from "./components/hero/Hero.jsx";
import Carrier from "./components/carrier/Carrier";
import Features from "./components/features/Features";
import Cards from "./components/card/Cards";
import Faq from "./components/faq/Faq";
import Banners from "./components/banner/Banners";
import Footer from "./components/footer/Footer";
import Lastfooter from "./lastfooter/Lastfooter";
import Animated from "./components/animated/Animated";

export default function New() {
  return (
    <>
      <div>
        <Navbar1 />
        <Hero />
        <Carrier />

        <Animated />

        <div className="prep">
          <Features />
          <div className="cfbfl">
            <Cards />
            <div className="fbfl">
              {" "}
              <Faq />
              <div className="BFL">
                <div className="banfoolast">
                  <Banners />
                  <Footer />
                  <Lastfooter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
