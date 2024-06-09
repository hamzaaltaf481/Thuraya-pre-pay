import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import cardsAnimationData from "../../animations/cards.json";
import phoneAnimationData from "../../animations/phone.json";

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
        autoplay: false, // Set autoplay to false initially
        animationData: cardsAnimationData,
      });

      // Start the animation on mouse enter
      cards.current.addEventListener("mouseenter", () => {
        cardsAnim.play();
      });

      // Stop the animation on mouse leave
      cards.current.addEventListener("mouseleave", () => {
        cardsAnim.stop();
      });
    }

    if (!phoneAnim) {
      phoneAnim = lottie.loadAnimation({
        container: phone.current,
        renderer: "svg",
        loop: false,
        autoplay: false, // Set autoplay to false initially
        animationData: phoneAnimationData,
      });

      // Start the animation on mouse enter
      phone.current.addEventListener("mouseenter", () => {
        phoneAnim.play();
      });

      // Stop the animation on mouse leave
      phone.current.addEventListener("mouseleave", () => {
        phoneAnim.stop();
      });
    }

    return () => {
      // Clean up event listeners when component unmounts
      cards.current.removeEventListener("mouseenter", () => {
        cardsAnim.play();
      });
      cards.current.removeEventListener("mouseleave", () => {
        cardsAnim.stop();
      });
      phone.current.removeEventListener("mouseenter", () => {
        phoneAnim.play();
      });
      phone.current.removeEventListener("mouseleave", () => {
        phoneAnim.stop();
      });
    };
  }, [cardsAnim, phoneAnim]);

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="flex justify-center gap-60  items-center">
        <div className=" flex flex-col w-[50%] h-[50%]">
        <div className="w-[100%] h-[100%] ml-10" ref={phone}></div>
        </div>
     
        <div className=" w-[50%] h-[50%]">
        <div className="w-[70%] h-[70%] pb-20" ref={cards}></div>
        </div>
      </div>
    </div>
  );
}
