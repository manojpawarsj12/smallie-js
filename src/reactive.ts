export type Signal<T> = {
  (): T;
  (newVal: T | ((prev: T) => T)): T;
  dispose?: () => void;
};

const effects: Array<() => void> = [() => {}];
const disposed = new WeakSet<() => void>();

/**
 * Creates a reactive signal.
 * This function returns a getter/setter function that holds a reactive value.
 *
 * @param value - The initial value of the signal.
 * @returns A function that can be used to get or update the signal's value.
 */
export function signal<T>(value: T): Signal<T> {
  const subs = new Set<() => void>();
  const s = ((newVal?: T | ((prev: T) => T)): T => {
    if (newVal === undefined) {
      subs.add(effects.at(-1)!);
      return value;
    }
    if (newVal !== value) {
      value =
        typeof newVal === "function"
          ? (newVal as (prev: T) => T)(value)
          : newVal;
      for (let eff of subs) {
        if (disposed.has(eff)) {
          subs.delete(eff);
        } else {
          eff();
        }
      }
    }
    return value;
  }) as Signal<T>;
  return s;
}

/**
 * Registers a side effect that runs when the signal changes.
 * The effect function subscribes to reactive updates and returns a disposer function.
 *
 * @param fn - The function to execute as a side effect.
 * @returns A function to dispose of the effect.
 */
export function effect(fn: () => void): () => void {
  effects.push(fn);
  try {
    fn();
    return () => {
      disposed.add(fn);
    };
  } finally {
    effects.pop();
  }
}

/**
 * Returns a derived reactive signal that automatically recalculates its value when its dependencies change.
 *
 * @param fn - A function that computes the derived value based on reactive dependencies.
 * @returns A new reactive signal that updates automatically.
 */
export function computed<T>(fn: () => T): Signal<T> {
  const s = signal<T>(fn());
  s.dispose = effect(() => {
    s(fn());
  });
  return s;
}
