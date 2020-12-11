// Remove some modern APIs to emulate legacy enviroments

delete globalThis.CSS
// eslint-disable-next-line no-undef
delete global.CSS
// eslint-disable-next-line no-undef
delete window.CSS
