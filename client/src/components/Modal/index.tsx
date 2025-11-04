import React from "react";
import { createPortal } from "react-dom";
import { ModalProps } from "./interface";
import classNames from "classnames";
import styles from "./styles.module.css";
import { CSSTransition } from "react-transition-group";
import { CloseButtonProps } from "./types";
import IconButton from "@/components/Buttons/IconButton";
import { Close } from "@/assets/icons";

function CloseButton({
  isShow,
  onClick,
}: CloseButtonProps): React.ReactElement | null {
  if (!isShow) return null;

  return (
    <IconButton className={styles.closeButton} onClick={onClick}>
      <Close />
    </IconButton>
  );
}

function ModalInner(
  {
    animationDuration = 250,
    withCloseButton = false,
    children,
    className,
    isOpen,
    onClose,
    ...other
  }: ModalProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(
    ref,
    (): HTMLDivElement => innerRef.current as HTMLDivElement,
  );

  const styleAnimation = {
    "--modal-duration": `${animationDuration}ms`,
  } as React.CSSProperties;

  const modalStyles = classNames(styles.modalWrap, className);

  const stop: (e: React.PointerEvent) => void = (
    e: React.PointerEvent,
  ): void => {
    e.stopPropagation();
  };

  return createPortal(
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
        className={modalStyles}
        onPointerDown={onClose}
        role="dialog"
        aria-modal="true"
        {...other}
      >
        <div className={styles.modalRoot} onPointerDown={stop}>
          <CloseButton isShow={withCloseButton} onClick={onClose} />
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.body,
  );
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(ModalInner);

export default Modal;
