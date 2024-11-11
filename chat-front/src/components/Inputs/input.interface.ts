export interface IInput {
  type: string;
  required: boolean;
  name: string;
  length: number;
  placeholder: string;
  label: string;
  pattern?: string;
  min?: number;
}
