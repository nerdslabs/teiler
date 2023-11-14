import type { CustomTheme } from "./Theme.svelte";

declare module '@teiler/core' {
  export interface DefaultTheme extends CustomTheme {}
}
