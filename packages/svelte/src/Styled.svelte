<script lang="ts">
  import type { DefaultTheme, HTMLElements, Sheet, StyleDefinition } from '@teiler/core'
  import { insert } from '@teiler/core'

  import { getStyleSheet } from './sheet'
  import { getContext } from 'svelte'
  import { context } from './ThemeProvider.svelte'

  export let styleDefinition: StyleDefinition<HTMLElements, unknown>

  const sheet: Sheet = getStyleSheet()

  const theme: DefaultTheme = getContext(context)

  const className = insert(sheet, styleDefinition, { ...$$restProps, theme })

  $: filtredPropsEntries = Object.entries($$restProps).filter(([key, _value]) => key[0] !== '_')
  $: filtredProps = Object.fromEntries(filtredPropsEntries)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={styleDefinition.tag}
  class={className + ' ' + styleDefinition.id}
  {...filtredProps}
  on:copy
  on:cut
  on:paste
  on:compositionend
  on:compositionstart
  on:compositionupdate
  on:focus
  on:focusin
  on:focusout
  on:blur
  on:change
  on:beforeinput
  on:input
  on:reset
  on:submit
  on:invalid
  on:formdata
  on:load
  on:error
  on:beforetoggle
  on:toggle
  on:keydown
  on:keypress
  on:keyup
  on:abort
  on:canplay
  on:canplaythrough
  on:cuechange
  on:durationchange
  on:emptied
  on:encrypted
  on:ended
  on:loadeddata
  on:loadedmetadata
  on:loadstart
  on:pause
  on:play
  on:playing
  on:progress
  on:ratechange
  on:seeked
  on:seeking
  on:stalled
  on:suspend
  on:timeupdate
  on:volumechange
  on:waiting
  on:auxclick
  on:click
  on:contextmenu
  on:dblclick
  on:drag
  on:dragend
  on:dragenter
  on:dragexit
  on:dragleave
  on:dragover
  on:dragstart
  on:drop
  on:mousedown
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:mouseout
  on:mouseover
  on:mouseup
  on:select
  on:selectionchange
  on:selectstart
  on:touchcancel
  on:touchend
  on:touchmove
  on:touchstart
  on:gotpointercapture
  on:pointercancel
  on:pointerdown
  on:pointerenter
  on:pointerleave
  on:pointermove
  on:pointerout
  on:pointerover
  on:pointerup
  on:lostpointercapture
  on:gamepadconnected
  on:gamepaddisconnected
  on:scroll
  on:scrollend
  on:resize
  on:wheel
  on:animationstart
  on:animationend
  on:animationiteration
  on:transitionstart
  on:transitionrun
  on:transitionend
  on:transitioncancel
  on:outrostart
  on:outroend
  on:introstart
  on:introend
  on:message
  on:messageerror
  on:visibilitychange
  on:cancel
  on:close
  on:fullscreenchange
  on:fullscreenerror><slot /></svelte:element
>
