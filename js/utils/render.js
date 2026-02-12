export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "className") {
      element.className = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else if (key === "innerHTML") {
      element.innerHTML = value;
    } else if (key.startsWith("on")) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "dataset") {
      for (const [dk, dv] of Object.entries(value)) {
        element.dataset[dk] = dv;
      }
    } else {
      element.setAttribute(key, value);
    }
  }
  if (typeof children === "string") {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    for (const child of children) {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    }
  }
  return element;
}

export function clearElement(id) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = "";
  return element;
}

export function setContent(id, ...nodes) {
  const container = clearElement(id);
  if (container) {
    for (const node of nodes) {
      if (typeof node === "string") {
        container.innerHTML = node;
      } else if (node instanceof Node) {
        container.appendChild(node);
      }
    }
  }
  return container;
}
