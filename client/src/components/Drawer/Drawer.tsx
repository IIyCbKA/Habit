import React from "react";
import { DrawerProps } from "./Drawer.interface";
import { CSSTransition } from "react-transition-group";
import styles from "./drawer.module.css";
import classNames from "classnames";

function DrawerInner(
  { animationDuration = 200, isOpen, className, ...other }: DrawerProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement | null {
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(
    ref,
    (): HTMLDivElement => innerRef.current as HTMLDivElement,
  );

  const containerStyles = classNames(styles.menuContainer, className);

  return (
    <CSSTransition
      nodeRef={innerRef}
      in={isOpen}
      timeout={animationDuration}
      classNames={{
        enterActive: styles.slideIn,
        exitActive: styles.slideOut,
      }}
      unmountOnExit
    >
      <div ref={innerRef} {...other} className={containerStyles} />
    </CSSTransition>
  );
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(DrawerInner);

export default Drawer;
