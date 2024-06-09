import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import cardsAnimationData from "../../animations/cards.json";
import phoneAnimationData from "../../animations/phone.json";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const cards = useRef();
  const phone = useRef();
  let cardsAnim, phoneAnim;

  useEffect(() => {
    if (!cardsAnim) {
      cardsAnim = lottie.loadAnimation({
        container: cards.current,
        renderer: "svg",
        loop: false,
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
        loop: false,
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
      <div className="flex justify-center gap-60 items-center">
        <div className="flex flex-col items-center w-[50%] h-[50%]">
          <Link  to="/quick_refill" className="w-[100%] h-[100%] ml-10 " ref={phone}></Link>

          <h1 className=" flex text-center mt-[-100px] font-extrabold text-5xl justify-center items-center gap-5">
            <FaArrowRight className=" inline-block " />
            Thuraya Quick Refill
          </h1>
        </div>
        <div className="flex flex-col items-center w-[50%] h-[50%]">
          <Link to="/refill_units" className="w-[70%] h-[70%] pb-44 " ref={cards}></Link>
          <h1 className=" flex text-center mt-[-100px] font-extrabold text-5xl justify-center items-center gap-5">
            <FaArrowRight className=" inline-block " />
            Thuraya Prepiad Units
          </h1>
        </div>
      </div>
    </div>
  );
}
