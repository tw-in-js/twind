const MOD =
  /* @__PURE__ */
  typeof navigator == 'object' && /* @__PURE__ */ /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ? 'Meta'
    : 'Control'

export const MOD_KEY = MOD == 'Meta' ? '⌘' : 'Ctrl'
