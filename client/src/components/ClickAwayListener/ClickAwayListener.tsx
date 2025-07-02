import React from "react";
import { ClickAwayListenerProps } from "./ClickAwayListener.interface";

const ClickAwayListener = <RefElType extends HTMLElement = HTMLElement>({
  children,
  onClickAway,
  clickEventType = "click",
  touchEventType = "touchend",
}: ClickAwayListenerProps<RefElType>): React.ReactElement => {
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
