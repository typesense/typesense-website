import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierConfig from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { ignores: ['content/.vitepress/dist/**', 'content/.vitepress/cache/**'] },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  prettierConfig,
  {
    // Layout is VitePress's slot convention, Tabs is referenced by name in
    // content markdown, and the ui/ names come from shadcn-vue
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    // vendored shadcn-vue components keep upstream's optional-prop style
    files: ['content/.vitepress/theme/components/ui/**'],
    rules: { 'vue/require-default-prop': 'off' },
  },
)
