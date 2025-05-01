/*
--------------RefreshSubscriber type--------------
This type is used in refresh interceptor

resolve  - is resolve :)
reject   - is reject  :)
*/

export interface RefreshSubscriber {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}
