import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginOxlint from 'eslint-plugin-oxlint';
import skipFormatting from 'eslint-config-prettier/flat';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/recommended-error'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,

  // 自定义的规则集
  {
    rules: {
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/define-props-declaration': ['error'],
      'vue/no-undef-components': [
        'error',
        {
          ignorePatterns: [],
        },
      ],
      'vue/no-unused-refs': ['error'],
      'vue/no-use-v-else-with-v-for': ['error'],
      'vue/prefer-use-template-ref': ['error'],
      'vue/require-macro-variable-name': [
        'error',
        {
          defineProps: 'props',
          defineEmits: 'emit',
          defineSlots: 'slots',
          useSlots: 'slots',
          useAttrs: 'attrs',
        },
      ],
    },
    'vue/require-prop-comment': ['error'],
    'vue/require-typed-ref': ['error'],
  },
);
