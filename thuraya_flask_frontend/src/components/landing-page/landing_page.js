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
      <div className="flex justify-center gap-30 items-center">
        <Link
          to="/quick_refill"
          className="flex flex-col items-center w-[40%] h-[40%]  hover:bg-[#b6db948c] transition duration-900 ml-10 rounded-xl p-10"
          style={{ color: "var(--blue-color)" }}
        >
          <div className="w-[100%] h-[100%] ml-10 " ref={phone}></div>

          <h1 className=" flex text-center mt-[-80px] font-extrabold text-4xl justify-center items-center gap-5">
            <FaArrowRight
              className=" inline-block "
              style={{ color: "var(--green-color)" }}
            />
            Thuraya Quick Refill
          </h1>
        </Link>
        <Link
          to="/refill_units"
          className="flex flex-col items-center w-[40%] h-[40%] hover:bg-[#b6db948c] transition duration-900 mr-10 rounded-xl p-10"
          style={{ color: "var(--blue-color)" }}
        >
          <div className="w-[65%] h-[100%] pb-44  z-10" ref={cards}></div>
          <h1 className=" flex text-center mt-[-100px] font-extrabold text-4xl justify-center items-center gap-5 z-0">
            <FaArrowRight
              className=" inline-block "
              style={{ color: "var(--green-color)" }}
            />
            Thuraya Prepiad Units
          </h1>
        </Link>
      </div>
    </div>
  );
}
