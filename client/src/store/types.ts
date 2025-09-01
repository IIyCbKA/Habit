/*
--------------RejectedPayload type--------------
*/
export type RejectedPayload = {
  detail: string;
};

/*
--------------AppThunkCfg type--------------
*/
export type AppThunkCfg = {
  rejectValue: RejectedPayload;
};
