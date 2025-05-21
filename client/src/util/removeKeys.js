export function removeKeys(obj, keysToRemove) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  );
}