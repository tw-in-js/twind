export const MOD_KEY =
  typeof navigator == 'object' && /* @__PURE__ */ /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ? '⌘'
    : 'Ctrl'
