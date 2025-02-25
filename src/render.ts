import { effect } from "./reactive";

export function html(
  tpl: TemplateStringsArray,
  ...data: unknown[]
): Node[] {
  const marker = "\ufeff";
  const t = document.createElement("template");
  t.innerHTML = tpl.join(marker);
  if (tpl.length > 1) {
    const iter = document.createNodeIterator(
      t.content,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    let n: Node | null;
    let idx = 0;
    while ((n = iter.nextNode())) {
      if (n instanceof Element && n.hasAttributes()) {
        for (const attr of Array.from(n.attributes)) {
          if (attr.value === marker) {
            render(n, attr.name, data[idx++]);
          }
        }
      } else if (
        n.nodeType === Node.TEXT_NODE &&
        n.nodeValue &&
        n.nodeValue.includes(marker)
      ) {
        let tmp = document.createElement("template");
        tmp.innerHTML = n.nodeValue.replaceAll(marker, "<!>");
        for (let child of Array.from(tmp.content.childNodes)) {
          if (child.nodeType === Node.COMMENT_NODE) {
            render(child, null, data[idx++]);
          }
        }
        (n as ChildNode).replaceWith(tmp.content);
    }
    }
  }
  return Array.from(t.content.childNodes);
}

type RenderValue = unknown;

export function render(
  node: Node,
  attr: string | null,
  value: RenderValue
): void {
  const run = typeof value === "function"
    ? (fn: (val: any) => void) => {
        let dispose: (() => void) | undefined;
        dispose = effect(() =>
          dispose && !node.isConnected ? dispose() : fn((value as () => any)())
        );
      }
    : (fn: (val: any) => void) => fn(value);

  if (attr) {
    if (node instanceof Element) {
      node.removeAttribute(attr);
      if (attr.startsWith("on") && typeof value === "function") {
        // assign event handler
        (node as any)[attr] = value;
      } else {
        run((val: any) => {
          if (attr === "value" || attr === "checked") {
            (node as any)[attr] = val;
          } else if (val === false) {
            node.removeAttribute(attr);
          } else {
            node.setAttribute(attr, String(val));
          }
        });
      }
    }
  } else {
    const key = Symbol();
    run((val: unknown) => {
        const updates = normalizeContent(val);
        for (const n of updates) (n as any)[key] = true;

        let currentNode: ChildNode | null = node as ChildNode;
        let previousNode: ChildNode | null = null;

        while (currentNode) {
            const next: ChildNode | null = currentNode.nextSibling;
            if (next && (next as any)[key]) {
                const update = updates.shift();
                if (update) {
                    next.replaceWith(update);
                    previousNode = update;
                } else {
                    next.remove();
                }
            }
            currentNode = next;
        }

        if (updates.length) {
            const target = previousNode || (node as ChildNode);
            target.after(...updates);
        }
    });
}
};

function normalizeContent(value: unknown): ChildNode[] {
if (value instanceof Node) return [value as ChildNode];
if (Array.isArray(value)) return value.flatMap(normalizeContent);
if (value === null || value === undefined) return [];
return [document.createTextNode(String(value))];
}
