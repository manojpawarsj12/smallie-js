// filepath: /typescript-library/typescript-library/src/list.ts

/**
 * The `each` function is used for rendering lists of items in the DOM.
 * It manages the creation, updating, and removal of DOM nodes based on the provided data.
 *
 * @param val - A signal or an array of items to be rendered.
 * @param getKey - A function that retrieves a unique key for each item.
 * @param tpl - A template function that generates DOM nodes for each item.
 * @returns A function that, when called, updates the DOM based on the current items.
 */
export function each<T>(
  val: T[] | (() => T[]),
  getKey: (item: T) => any,
  tpl: (item: T, index: number) => Node[]
): () => Node[] {
  let a: any[] = [];
  let aNodes: Node[] = [];
  return () => {
    const items = typeof val === "function" ? (val as () => T[])() : val;
    const b = items.map(getKey);
    const aIdx = new Map(a.map((v, i) => [v, i]));
    const bIdx = new Map(b.map((v, i) => [v, i]));
    const bNodes: Node[] = [];
    for (let i = 0, j = 0; i !== a.length || j !== b.length; ) {
      let aElm = a[i],
        bElm = b[j];
      if (aElm === null) {
        i++;
      } else if (j >= b.length) {
        (aNodes[i++] as ChildNode).remove();
      } else if (i >= a.length) {
        bNodes.push(tpl(items[j], j)[0]);
        j++;
      } else if (aElm === bElm) {
        bNodes[j++] = aNodes[i++];
      } else {
        let oldIdx = aIdx.get(bElm);
        if (bIdx.get(aElm) === undefined) {
          (aNodes[i++] as ChildNode).remove();
        } else if (oldIdx === undefined) {
          bNodes[j] = tpl(items[j], j)[0];
          (aNodes[i] as ChildNode).before(bNodes[j]);
          j++;
        } else {
          bNodes[j++] = aNodes[oldIdx];
          (aNodes[i] as ChildNode).before(aNodes[oldIdx]);
          a[oldIdx] = null;
          if (oldIdx > i + 1) i++;
        }
      }
    }
    a = b;
    aNodes = bNodes;
    return [...aNodes];
  };
}
