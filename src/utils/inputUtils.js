/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler) {
  return event => handler(event.target.checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler) {
  return event => handler(event.target.value);
}

/** Event handler that exposes the target element's value as a number. */
export function handleNumberChange(handler) {
  return handleStringChange(value => handler(+value));
}

/** Event handler that exposes the target element's key pressed as a string. */
export function handleKeyPress(handler) {
  return event => handler(event.key);
}
