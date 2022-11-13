import { tw, cx, tx, css, style } from "twind"

// imported and executed once after the tw instance has been created but before new document.body is set

export async function beforeUpdate() {
  // runs every time before a new document.body is set
}

export async function afterUpdate() {
  // runs every time after a new document.body is set
}

export async function dispose() {
  // runs before a new script is activated
}
