import { signal, html, computed, each } from "/dist/smallie-js.esm.js";

/** @typedef {{ id: number; text: string; done: boolean; }} Todo */

// Reactive state
const todos = signal([]);
const newTodo = signal("");

// Add a new todo
const addTodo = () => {
  if (newTodo().trim()) {
    todos([
      ...todos(),
      {
        text: newTodo(),
        completed: false,
      },
    ]);
    newTodo("");
  }
};
// Toggle todo completion
const toggleTodo = (todo) => {
  todos((items) =>
    items.map((item) =>
      item === todo
        ? {
            ...todo,
            completed: !todo.completed,
          }
        : item
    )
  );
};
// Remove a todo
const removeTodo = (todo) => {
  todos((items) => items.filter((item) => item !== todo));
};
// Computed: Count of remaining todos
const remainingTodos = computed(
  () => todos().filter((todo) => !todo.completed).length
);

// Render the app
const app = html`<div>
  <h1>Todo App</h1>
  <input
    type="text"
    value=${newTodo}
    oninput=${(e) => newTodo(e.target.value)}
    placeholder="Add a new todo"
  />
  <button onclick=${addTodo}>Add</button>
  <ul>
    ${each(
      todos,
      (item) => item,
      (todo) => html`<li>
        <input
          type="checkbox"
          checked=${() => todo.completed}
          onchange=${() => toggleTodo(todo)}
        />
        <span
          style=${() => (todo.completed ? "text-decoration: line-through" : "")}
        >
          ${todo.text}
        </span>
        <button onclick=${() => removeTodo(todo)}>Remove</button>
      </li>`
    )}
  </ul>
  <p>${remainingTodos} items left</p>
</div>`;

document.body.append(...app);
