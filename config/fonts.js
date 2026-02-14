import { Atomic_Age, Oxanium } from "next/font/google";

export const atomic_age = Atomic_Age({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
