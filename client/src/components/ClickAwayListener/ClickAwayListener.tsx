import React from "react";
import { ClickAwayListenerProps } from "./ClickAwayListener.interface";
import { ClickType, TouchType } from "./clickAwayListener.enums";

const ClickAwayListener = <RefElType extends HTMLElement = HTMLElement>(
  props: ClickAwayListenerProps<RefElType>,
): React.ReactElement => {
  const {
    children,
    onClickAway,
    clickEventType = ClickType.OnClick,
    touchEventType = TouchType.OnTouchEnd,
  } = props;

  const nodeRef = React.useRef<RefElType | null>(null);

  React.useEffect((): (() => void) => {
    const handle: (event: Event) => void = (event: Event): void => {
      if (nodeRef.current?.contains(event.target as Node)) return;
      onClickAway();
    };

    document.addEventListener(clickEventType, handle);
    document.addEventListener(touchEventType, handle);
    return (): void => {
      document.removeEventListener(clickEventType, handle);
      document.removeEventListener(touchEventType, handle);
    };
  }, [onClickAway, clickEventType, touchEventType]);

  return <>{children(nodeRef)}</>;
};

export default ClickAwayListener;
