export const NATIVE_ANIMATION_DEFAULT_DURATION = 150;
export const NATIVE_ANIMATION_DEFAULT_DELAY = 0;

export function reduce<Return>(
  obj: Record<string, any>,
  callback: (acc: Return, key: string) => void,
) {
  return Object.keys(obj).reduce((acc, key) => {
    callback(acc, key);
    return acc;
  }, {} as Return);
}
