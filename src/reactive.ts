export type Signal<T> = {
  (): T;
  (newVal: T | ((prev: T) => T)): T;
  dispose?: () => void;
};

const effects: Array<() => void> = [() => {}];
const disposed = new WeakSet<() => void>();

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

export function computed<T>(fn: () => T): Signal<T> {
  const s = signal<T>(fn());
  s.dispose = effect(() => {
    s(fn());
  });
  return s;
}
