import { signal, effect, computed } from "../src/reactive";

describe("Reactive functions", () => {
  test("signal getter and setter", () => {
    const s = signal(10);
    expect(s()).toBe(10);
    s(20);
    expect(s()).toBe(20);
  });

  test("effect runs when signal changes", () => {
    const s = signal(1);
    let triggered = false;
    effect(() => {
      s(); // subscribe to s
      triggered = true;
    });
    s(2);
    expect(triggered).toBe(true);
  });

  test("computed updates", () => {
    const s = signal(2);
    const c = computed(() => s() * 2);
    expect(c()).toBe(4);
    s(3);
    expect(c()).toBe(6);
  });
});
