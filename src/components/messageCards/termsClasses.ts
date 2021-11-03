import { css } from "@emotion/css";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

const maxHeight = "3em";
export const duration = 200;
const maxHeightTransition = `max-height ${duration}ms ease-out`;

export const termsClasses: CSSTransitionClassNames = {
  enter: css({
    maxHeight: 0,
  }),
  enterActive: css({
    maxHeight,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
  exit: css({
    maxHeight,
  }),
  exitActive: css({
    maxHeight: 0,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
};
