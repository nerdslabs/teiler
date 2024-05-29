import type { CustomTheme } from "./customTheme";

declare module '@teiler/core' {
  export interface DefaultTheme extends CustomTheme {}
}
