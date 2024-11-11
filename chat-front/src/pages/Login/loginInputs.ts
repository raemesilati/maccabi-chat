import { IInput } from "../../components/Inputs/input.interface";

export const loginInputs: IInput[] = [
  {
    name: "email",
    length: 50,
    required: true,
    type: "email",
    label: "דואר אלקטרוני",
    placeholder: "דואר אלקטרוני",
  },
  {
    name: "password",
    length: 50,
    required: true,
    type: "password",
    label: "סיסמא",
    placeholder: "הכנס סיסמא",
  },
];
