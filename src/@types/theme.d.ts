import { theme } from "@/styles/theme";
import "styled-components";

export type ITheme = typeof theme;

declare module "styled-components" {
  export type DefaultTheme = ITheme
}
