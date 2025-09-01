/*
--------------RefreshSubscriber type--------------
*/
export type RefreshSubscriber = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
};
