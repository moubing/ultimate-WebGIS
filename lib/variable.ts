import { fitOption } from "./types";

let FitOption: fitOption = "jumpTo";

export function setFitOption(value: fitOption) {
  FitOption = value;
}

export function getFitOption() {
  return FitOption;
}
