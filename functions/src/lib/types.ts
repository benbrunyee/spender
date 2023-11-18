export type FunctionReturnData<T extends object = {}> = {
  msg: string;
  success: boolean;
  error?: any;
  body?: object;
} & T;

export enum Provider {
  Monzo = "monzo",
}
