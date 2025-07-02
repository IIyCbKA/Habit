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

  const styleAnimation = {
    "--drawer-duration": `${animationDuration}ms`,
  } as React.CSSProperties;

  const containerStyles = classNames(styles.menuContainer, className);

  return (
    <CSSTransition
      nodeRef={innerRef}
      in={isOpen}
      timeout={animationDuration}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exit: styles.exit,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
      }}
      unmountOnExit
    >
      <div
        ref={innerRef}
        style={styleAnimation}
        {...other}
        className={containerStyles}
      />
    </CSSTransition>
  );
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(DrawerInner);

export default Drawer;
