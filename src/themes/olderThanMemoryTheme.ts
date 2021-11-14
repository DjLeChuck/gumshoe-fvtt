import { css } from "@emotion/react";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { Theme } from "./types";

const accent = "#fda994";

export const olderThanMemoryTheme: Theme = themeFactory({
  schemaVersion: "v1",
  displayName: "Older Than Memory",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  largeSheetRootStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/red_sands.jpg)`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  },
  smallSheetRootStyle: {
    backgroundImage: `linear-gradient( to right, #0009,#0009), url(systems/${systemName}/assets/wallpaper/red_sands.jpg)`,
    backgroundPosition: "center",
    backgroundSize: "auto",
  },
  appWindowStyle: {
    boxShadow: `0 0 20px ${accent}`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1.1em 'Longdon Decorative Regular', serif",
  logo: {
    fontScaleFactor: 24,
    frontTextElementStyle: {
      color: "#fff",
      // maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
      // maskMode: "luminance",
      // maskRepeat: "repeat",
      // maskSize: "contain",
      textShadow: [
        `0 0 0.5em ${accent}`,
        `0 0 0.2em ${accent}`,
        `0 0 1em ${accent}`,
        `0 0 2em ${accent}`,
      ].join(", "),
    },
    rearTextElementStyle: {
      // display: "none",
      border: `2px solid ${accent}`,
      borderRadius: "3em",
      boxShadow: [
        `0 0 0.5em 0 inset ${accent}`,
        `0 0 0.5em 0 ${accent}`,
      ].join(","),
      backgroundImage: [
        `radial-gradient(closest-side, ${accent}77 0%, ${accent}00 100%)`,
        "linear-gradient(to bottom, #6667, #0007)",
      ].join(", "),
      padding: "0.1em",
    },
    textElementsStyle: {
      transform: "scale(0.6)",
      fontWeight: "bold",
    },
    backdropStyle: {

    },
  },
  colors: {
    accent: "#fed0c5",
    accentContrast: "#333",
    glow: accent,
    wallpaper: "#333",
    backgroundPrimary: "#111c",
    backgroundSecondary: "#1119",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#ccc", // "#9ad6de",
  },
});
