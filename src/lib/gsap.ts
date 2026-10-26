"use client";

// Single registration point for GSAP plugins. Import gsap from here, never from "gsap" directly.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, Draggable, Flip, useGSAP };
