import { each } from "../src/each";

describe("each function", () => {
  test("renders list items", () => {
    const items = [1, 2, 3];
    const renderer = each(
      items,
      (item) => item,
      (item, index) => {
        const el = document.createElement("div");
        el.textContent = String(item);
        return [el];
      }
    );
    const nodes = renderer();
    expect(nodes.length).toBe(3);
    expect(nodes[0].textContent).toBe("1");
  });
});
