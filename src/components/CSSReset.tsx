/** @jsx jsx */
import { Global, jsx } from "@emotion/react";
import React from "react";
import { ThemeContext, Theme } from "../theme";

type CSSResetProps = {
  children: any,
  className?: string,
  theme: Theme,
  shroudBackground?: boolean,
};

export const CSSReset: React.FC<CSSResetProps> = ({
  className,
  children,
  theme,
  shroudBackground,
}: CSSResetProps) => {
  return (
    <ThemeContext.Provider value={theme}>
      <Global styles={theme.global} />
      <div
        className={className}
        css={{
          font: theme.bodyFont,
          padding: "0.5em",
          color: theme.colors.text,
          ...theme.rootElementStyle,

          "*": {
            // all: "initial",
            scrollbarWidth: "thin",
            userSelect: "auto",
            boxSizing: "border-box",
            scrollbarColor: `${theme.colors.accent} ${theme.colors.bgTint}`,
            "&:focus": {
              textDecoration: "underline",
            },
          },

          "h1, h2, h3, h4": {
            border: "none",
            margin: "0.3em 0 0 0",
            padding: 0,
            fontWeight: "inherit",
            font: theme.displayFont,
          },
          h1: {
            fontSize: "1.5em",
          },
          h2: {
            fontSize: "1.3em",
          },
          h3: {
            fontSize: "1.1em",
          },
          h4: {
            fontSize: "1em",
          },
          button: {
            font: theme.displayFont,
            color: theme.colors.accent,
            "&[disabled]": {
              opacity: 0.5,
              color: theme.colors.text,
              "&:hover": {
                boxShadow: "none",
                textShadow: "none",
              },
            },
            "&:hover": {
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
              textShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
            "&:focus": {
              boxShadow: "none",
            },
          },
          label: {
            font: theme.displayFont,
          },
          "a, label.parp": {
            color: theme.colors.accent,
          },
          "a:hover, a.hover, .hover a, label.parp:hover, label.parp.hover, .hover label.parp": {
            textDecoration: "underline",
            textShadow: `0 0 0.5em ${theme.colors.glow}`,
          },
          "input, input[type=text], textarea": {
            font: theme.bodyFont,
            fontVariantLigatures: "none",
            color: theme.colors.accent,
            padding: "0.1em 0.3em",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: theme.colors.text,
            background: theme.colors.bgTransPrimary,
            resize: "vertical",
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          select: {
            color: theme.colors.text,
            background: theme.colors.bgOpaquePrimary,
            ":focus": {
              borderColor: theme.colors.accent,
              outline: "none",
              boxShadow: `0 0 0.5em ${theme.colors.glow}`,
            },
          },
          textarea: {
            lineHeight: 1,
          },
          "button, input[type=button]": {
            border: `2px groove ${theme.colors.text}`,
            background: theme.colors.bgTint,
          },
        }}
      >
        <div
          className="shroud"
          css={{
            display: "block",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            // overflow: "auto",
            backgroundColor: shroudBackground ? theme.colors.bgTransSecondary : "transparent",
            zIndex: -1000,
          }}
        >
        </div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
