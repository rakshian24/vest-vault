export interface ICreateGrantFormValueTypes {
  grantDate: string;
  grantAmount: number;
  stockPrice: number;
}

export const InitCreateGrantFormValues: ICreateGrantFormValueTypes = {
  grantDate: "",
  grantAmount: 0,
  stockPrice: 0,
};
