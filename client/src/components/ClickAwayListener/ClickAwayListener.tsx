import React from "react";
import { ClickAwayListenerProps } from "./ClickAwayListener.interface";
import { ClickType, TouchType } from "./clickAwayListener.enums";

export default function ClickAwayListener({
  children,
  onClickAway,
  clickEventType = ClickType.OnClick,
  touchEventType = TouchType.OnTouchEnd,
}: ClickAwayListenerProps): React.ReactElement {
  const nodeRef = React.useRef<HTMLElement | null>(null);

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
}
