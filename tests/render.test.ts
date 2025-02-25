import { html } from "../src/render";

describe("DOM functions", () => {
  test("html creates nodes from template", () => {
    const nodes = html`<div>Hello World</div>`;
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes[0].nodeName).toBe("DIV");
  });
});
