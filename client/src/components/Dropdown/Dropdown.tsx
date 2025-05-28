import React from "react";
import styles from "./dropdown.module.css";
import { DropdownProps } from "./Dropdown.interface";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";

function DropdownInner(
  { isOpen, animationDuration = 200, className, ...other }: DropdownProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const innerRef = React.useRef<HTMLDivElement>(null);

  const containerStyles = classNames(styles.dropdownContainer, className);

  React.useImperativeHandle(
    ref,
    (): HTMLDivElement => innerRef.current as HTMLDivElement,
  );

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

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(DropdownInner);

export default Dropdown;
