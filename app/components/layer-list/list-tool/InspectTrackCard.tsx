"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";

function InspectTrackCard() {
  const xRef = useRef((num: number) => {});
  const yRef = useRef((num: number) => {});

  const { contextSafe } = useGSAP(() => {
    xRef.current = gsap.quickTo("#track-square", "x", {
      duration: 0.8,
      ease: "power3",
    });
    yRef.current = gsap.quickTo("#track-square", "y", {
      duration: 0.8,
      ease: "power3",
    });
  });

  const handleTrack = contextSafe((e: { clientX: any; clientY: any }) => {
    xRef.current(e.clientX);
    yRef.current(e.clientY);
  });

  useEffect(() => {
    document.addEventListener("mousemove", handleTrack);

    return () => {
      document.removeEventListener("mousemove", handleTrack);
    };
  }, [handleTrack]);

  return (
    <div
      id="track-square"
      className="size-12 pointer-events-none -translate-x-1/2  bg-emerald-500 rounded-lg fixed z-50 -top-20"
    />
  );
}

export default InspectTrackCard;
