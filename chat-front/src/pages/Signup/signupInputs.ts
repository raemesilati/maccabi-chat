import { IInput } from "../../components/Inputs/input.interface";

export const signupInputs: IInput[] = [
  {
    name: "fullName",
    length: 50,
    required: true,
    type: "fullName",
    label: "שם מלא",
    placeholder: "הכנס שם מלא",
  },
  {
    name: "email",
    length: 50,
    required: true,
    type: "email",
    label: "דואר אלקטרוני",
    placeholder: "הכנס דואר אלקטורני",
  },
  {
    name: "password",
    length: 50,
    required: true,
    type: "password",
    label: "סיסמא",
    placeholder: "הכנס סיסמא",
    min: 6,
  },
  {
    name: "confirmPassword",
    length: 50,
    required: true,
    type: "password",
    label: "אשר סיסמא",
    placeholder: "אשר סיסמא",
    min: 6,
  },
];
