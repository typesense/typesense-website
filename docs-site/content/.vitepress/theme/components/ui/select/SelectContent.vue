<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit, unrefElement, useResizeObserver, useScroll } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(), {
  position: 'popper',
})
const emits = defineEmits<SelectContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const viewport = useTemplateRef<InstanceType<typeof SelectViewport>>('viewport')
const viewportEl = computed(() => unrefElement(viewport))
// useScroll only measures on scroll, and the viewport mounts on open and resizes once positioned
const { arrivedState, measure } = useScroll(viewportEl)
useResizeObserver(viewportEl, measure)
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'relative z-50 max-h-[min(24rem,var(--reka-select-content-available-height))] min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md origin-[var(--reka-select-content-transform-origin)] ease-out-expo data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          props.class,
        )
      "
    >
      <div class="relative flex min-h-0 flex-1 flex-col">
        <div
          v-if="!arrivedState.top"
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-popover from-25% animate-in fade-in-0"
        />
        <!-- the padding keeps focused and selected rows clear of the fades -->
        <SelectViewport
          ref="viewport"
          :class="
            cn(
              'scroll-py-12 p-1 overscroll-contain',
              position === 'popper' &&
                'h-[var(--reka-select-trigger-height)] w-full min-w-[var(--reka-select-trigger-width)]',
            )
          "
        >
          <slot />
        </SelectViewport>
        <div
          v-if="!arrivedState.bottom"
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-popover from-25% animate-in fade-in-0"
        />
      </div>
      <slot name="footer" />
    </SelectContent>
  </SelectPortal>
</template>
