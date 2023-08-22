import { type Sheet, createStyleSheet } from "@teiler/core";
import { getContext } from "svelte";

export const styleSheet = createStyleSheet({})

export const StyleSheet = 'STYLE_SHEET'

export function getStyleSheet(): Sheet {
  return getContext(StyleSheet) || styleSheet;
}
