import { baseUrl } from "./constants";

export function generateGdalInfoApi(source: string) {
  return `${baseUrl}/gdalInfo?inputFileName=${source}`;
}

export function generateDisplayApi(
  inputFileName: string,
  outputFileName: string,
  linear: string,
  red: string,
  green: string,
  blue: string
) {
  return `${baseUrl}/display?inputFileName=${inputFileName}&outputFileName=${outputFileName}&linear=${linear}&grey=none&red=${red}&green=${green}&blue=${blue}`;
}
