import {definePlugin} from 'sanity'
import PluginIcon from './icon'
import pluginPage from './plugin'
import {route} from 'sanity/router'
import {lazy} from 'react'

interface aioaPluginConfig {
  /* nothing here yet */
}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {myPlugin} from 'sanity-plugin-all-in-one-accessibility'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [myPlugin()],
 * })
 * ```
 */
// export const myPlugin = definePlugin<MyPluginConfig | void>((config = {}) => {
//   // eslint-disable-next-line no-console
//   console.log('hello from sanity-plugin-all-in-one-accessibility')
//   return {
//     name: 'sanity-plugin-all-in-one-accessibility',
//   }
// })


/*
export const AllinOneAccessibilityPlugin = definePlugin<aioaPluginConfig | void>((config = {}) => {
  return {
    name: 'All in One Accessibility',
    studio: {
      components: {
        activeToolLayout:AllinOneAccessibilityPlugin
      }
    },
    component: plugin,
    tools: (prev) => {
      return [
        ...prev,
        {
          title: 'All in One Accessibility',
          name: 'sanity-plugin-all-in-one-accessibility',
          icon: PluginIcon,
          component: plugin,
        },
      ]
    },
  }
})*/

import React from 'react'
import {AssetSource, Tool as SanityTool, } from 'sanity'

const plugin = {
  icon: PluginIcon,
  name: 'sanity-plugin-all-in-one-accessibility',
  title: 'All in One Accessibility',
}

const tool = {
  ...plugin,
  component: pluginPage,
} satisfies SanityTool

export const AllinOneAccessibilityPlugin = definePlugin<aioaPluginConfig | void>(options => ({
  name: 'sanity-plugin-all-in-one-accessibility',
  tools: prev => {
    return [...prev, tool]
  }
}))