/*
--------------ClickType enum--------------
The enum ClickType specifies type of click event for listener.
By default, type is OnClick
*/

export const enum ClickType {
  OnClick = "click",
  OnMouseDown = "mousedown",
  OnMouseUp = "mouseup",
}

/*
--------------TouchType enum--------------
The enum TouchType specifies type of touch event for listener.
By default, type is OnTouchEnd
*/

export const enum TouchType {
  OnTouchStart = "touchstart",
  OnTouchEnd = "touchend",
}
