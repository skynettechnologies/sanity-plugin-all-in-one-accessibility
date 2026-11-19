import {AIOA_LOGO_PATH} from './config'

/**
 * Studio navigation icon: the All in One Accessibility figure, drawn in the
 * current text color like Sanity's own tool icons (no image download).
 */
const PluginIcon = () => (
  <svg
    viewBox="0 0 69 69"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d={AIOA_LOGO_PATH} />
  </svg>
)

export default PluginIcon
