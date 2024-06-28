import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import cardsAnimationData from "../../animations/cards.json";
import phoneAnimationData from "../../animations/phone.json";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../src/components/landing-page/lp.css";

export default function LandingPage() {
  const cards = useRef();
  const phone = useRef();
  let cardsAnim, phoneAnim;

  useEffect(() => {
    if (!cardsAnim) {
      cardsAnim = lottie.loadAnimation({
        container: cards.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: cardsAnimationData,
      });

      cards.current.addEventListener("mouseenter", () => {
        cardsAnim.play();
      });

      cards.current.addEventListener("mouseleave", () => {
        cardsAnim.stop();
      });
    }

    if (!phoneAnim) {
      phoneAnim = lottie.loadAnimation({
        container: phone.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: phoneAnimationData,
      });

      phone.current.addEventListener("mouseenter", () => {
        phoneAnim.play();
      });

      phone.current.addEventListener("mouseleave", () => {
        phoneAnim.stop();
      });
    }

    return () => {
      if (cards.current) {
        cards.current.removeEventListener("mouseenter", () => {
          cardsAnim.play();
        });
        cards.current.removeEventListener("mouseleave", () => {
          cardsAnim.stop();
        });
      }
      if (phone.current) {
        phone.current.removeEventListener("mouseenter", () => {
          phoneAnim.play();
        });
        phone.current.removeEventListener("mouseleave", () => {
          phoneAnim.stop();
        });
      }
    };
  }, [cardsAnim, phoneAnim]);

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row justify-center gap-10 items-center container mx-auto mt-20 pb-10 px-5">
        <Link
          to="/quick_refill"
          className="flex flex-col items-center gap-3 w-full md:w-1/2 lg:h-[500px] hover:bg-[#b6db948c] transition duration-900 rounded-xl p-5 md:p-10"
          style={{ color: "var(--blue-color)" }}
        >
          <div className="w-full flex justify-center items-center lg:pt-20">
            <div
              className="w-full h-full"
              ref={phone}
              style={{ height: "200px" }}
            ></div>
          </div>
          <h1 className="flex text-center font-extrabold text-xl md:text-2xl lg:text-4xl justify-center items-center gap-5 mt-5 md:mt-0">
            <FaArrowRight style={{ color: "var(--green-color)" }} />
            Thuraya Quick Refill
          </h1>
        </Link>
        <Link
          to="/refill_units"
          className="flex flex-col items-center w-full md:w-1/2 lg:h-[500px] hover:bg-[#b6db948c] transition duration-900 rounded-xl p-5 md:p-10"
          style={{ color: "var(--blue-color)" }}
        >
          <div className="w-full flex justify-center items-center lg:pt-24">
            <div
              className="w-full h-full pb-10"
              ref={cards}
              style={{ height: "200px" }}
            ></div>
          </div>
          <h1 className="flex text-center font-extrabold text-xl md:text-2xl lg:text-4xl justify-center items-center gap-5 mt-5 md:mt-0">
            <FaArrowRight style={{ color: "var(--green-color)" }} />
            Thuraya Prepaid Units
          </h1>
        </Link>
      </div>
    </div>
  );
}
