import {definePlugin, type Tool} from 'sanity'

import PluginIcon from './icon'
import SettingsPage, {type AllinOneAccessibilityOptions} from './plugin'

export type {AllinOneAccessibilityOptions}

/**
 * All in One Accessibility® settings as a Studio tool.
 *
 * Usage in `sanity.config.ts` (or .js):
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {AllinOneAccessibilityPlugin} from 'sanity-plugin-all-in-one-accessibility'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [
 *     AllinOneAccessibilityPlugin({
 *       // Optional: the website the widget runs on (default: the Studio's hostname)
 *       websiteUrl: 'www.example.com',
 *     }),
 *   ],
 * })
 * ```
 */
export const AllinOneAccessibilityPlugin = definePlugin<AllinOneAccessibilityOptions | void>(
  (options) => {
    const tool: Tool<AllinOneAccessibilityOptions> = {
      name: 'sanity-plugin-all-in-one-accessibility',
      title: 'All in One Accessibility',
      icon: PluginIcon,
      component: SettingsPage,
      options: options || {},
    }

    return {
      name: 'sanity-plugin-all-in-one-accessibility',
      tools: (prev) => [...prev, tool],
    }
  },
)
