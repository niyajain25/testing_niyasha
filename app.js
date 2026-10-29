(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const count = document.getElementById("todo-count");
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");

  const save = () => localStorage.setItem("todos", JSON.stringify(todos));

  function render() {
    list.innerHTML = "";
    todos.forEach((t, i) => {
      const li = document.createElement("li");
      if (t.done) li.className = "done";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = t.done;
      cb.style.width = "auto";
      cb.addEventListener("change", () => { todos[i].done = cb.checked; save(); render(); });
      const span = document.createElement("span");
      span.textContent = t.text;
      const del = document.createElement("button");
      del.textContent = "✕";
      del.setAttribute("aria-label", "Delete task");
      del.addEventListener("click", () => { todos.splice(i, 1); save(); render(); });
      li.append(cb, span, del);
      list.append(li);
    });
    const left = todos.filter(t => !t.done).length;
    count.textContent = todos.length ? `${left} of ${todos.length} remaining` : "Nothing yet. Add your first task!";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    input.value = "";
    save();
    render();
  });
  render();

  document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("contact-status").textContent = "Thanks! (Demo form: hook this up to your backend or a form service.)";
    e.target.reset();
  });
})();
