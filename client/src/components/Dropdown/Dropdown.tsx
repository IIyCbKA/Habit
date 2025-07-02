import React from "react";
import styles from "./dropdown.module.css";
import { DropdownProps } from "./Dropdown.interface";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";

function DropdownInner(
  { isOpen, animationDuration = 250, className, ...other }: DropdownProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(
    ref,
    (): HTMLDivElement => innerRef.current as HTMLDivElement,
  );

  const styleAnimation = {
    "--dropdown-duration": `${animationDuration}ms`,
  } as React.CSSProperties;

  const containerStyles = classNames(styles.dropdownContainer, className);

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

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(DropdownInner);

export default Dropdown;
