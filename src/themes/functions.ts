import Irid from "irid";
import { ThemeV1, ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";

const defaultFontScaleFactor = 14;

/**
 * Given two colors, create a third which is the result of overlaying the second
 * on the first
 */
const overlay = (baseString: string, layerString: string): string => {
  const layer = Irid(layerString);
  const opacity = layer.opacity();
  const layerOpaque = layer.opacity(1);
  const result = Irid(baseString).blend(layerOpaque, opacity);
  return result.toRGBString();
};

/**
 * Turn a ThemeSeed (bare basics for defining a theme) into a fully usable
 * theme
 */
export const themeFactory = (seed: ThemeSeedV1): ThemeV1 => {
  const bgOpaquePrimary = overlay(seed.colors.wallpaper, seed.colors.backgroundPrimary);
  const bgOpaqueSecondary = overlay(seed.colors.wallpaper, seed.colors.backgroundSecondary);

  const bgTransPrimary = Irid(seed.colors.backgroundPrimary);
  const bgTransSecondary = Irid(seed.colors.backgroundSecondary);
  const danger = Irid(seed.colors.danger ?? "red");

  const bgTransDangerPrimary = bgTransPrimary.blend(danger, 0.5).opacity(bgTransPrimary.opacity()).toRGBString();
  const bgTransDangerSecondary = bgTransSecondary.blend(danger, 0.5).opacity(bgTransSecondary.opacity()).toRGBString();
  const bgOpaqueDangerPrimary = overlay(seed.colors.wallpaper, bgTransDangerPrimary);
  const bgOpaqueDangerSecondary = overlay(seed.colors.wallpaper, bgTransDangerSecondary);

  const controlBorder = seed.colors.controlBorder ?? seed.colors.text;

  return {
    ...seed,
    largeSheetRootStyle: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      ...seed.largeSheetRootStyle,
    },
    smallSheetRootStyle: seed.smallSheetRootStyle ?? seed.largeSheetRootStyle,
    colors: {
      ...seed.colors,
      bgOpaquePrimary,
      bgOpaqueSecondary,
      bgTransDangerPrimary,
      bgTransDangerSecondary,
      bgOpaqueDangerPrimary,
      bgOpaqueDangerSecondary,
      controlBorder,
    },
    logo: {
      ...seed.logo,
      fontScaleFactor: seed.logo.fontScaleFactor ?? defaultFontScaleFactor,
    },
  };
};

export const createStarburstGradient = (
  colors: string[],
  numRepeats: number,
  xPos: string,
  yPos: string,
) => {
  const numColors = colors.length;
  const wedgeAngle = 360 / (numRepeats * numColors);
  const gradientParts = colors
    .map((color, i) => `${color} ${wedgeAngle * i}deg ${wedgeAngle * (i + 1)}deg`)
    .join(", ");
  const starburstGradient = `repeating-conic-gradient(from 0deg at ${xPos} ${yPos}, ${gradientParts})`;

  return starburstGradient;
};
