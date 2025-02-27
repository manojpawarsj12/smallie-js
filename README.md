# smolie-js

This project is a TypeScript library that provides a signal and effect management system along with HTML rendering functions. It is designed to facilitate the creation and manipulation of DOM elements in a reactive manner under 1kb.

## Installation

To install the library, you can use npm:

```
npm install smolie-js
```


## Usage

### Importing the Library

You can import the library in your TypeScript or JavaScript files as follows:

```typescript
import { signal, effect, html, each , computed } from 'smolie-js';
```

### Signal and Effect Management

The library provides a simple way to manage reactive state using signals and effects.

```typescript
const count = signal(0);

effect(() => {
  console.log(`Count is: ${count()}`);
});

count(1); // This will trigger the effect and log "Count is: 1"
```

### HTML Rendering

You can create HTML templates and bind data using the `html` function.

```typescript
const template = html`<div>Hello, ${name}!</div>`;
document.body.append(...template);
```

### Rendering Lists

The `each` function allows you to render lists of items efficiently.

```typescript
const items = signal(['Item 1', 'Item 2', 'Item 3']);
const renderList = each(items, (item) => html`<li>${item}</li>`);

document.body.append(...renderList());
```

## API Reference

### Functions

- **signal(value: any): Function** - Creates a reactive signal.
- **effect(fn: Function): Function** - Registers a side effect that runs when the signal changes.
- **html(tpl: TemplateStringsArray, ...data: any[]): Node[]** - Creates a template and binds data.
- **each(val: any, getKey: Function, tpl: Function): Function** - Renders a list of items.
- **computed(fn: Function): Function** – Returns a derived reactive signal that automatically recalculates its value when its dependencies change.
- **render(node: Node, attr: string | null, value: any): void** – Reactively updates a DOM node by setting an attribute (if provided) or updating its child content based on the given reactive value or function.


## License

This project is licensed under the MIT License. See the LICENSE file for more details.