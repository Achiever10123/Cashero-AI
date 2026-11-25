let container = null;
let nextToastId = 0;
const toastTimers = new Map();

function dismissToast(id) {
  clearTimeout(toastTimers.get(id));
  toastTimers.delete(id);
  const toast = container?.querySelector(`[data-toast-id="${id}"]`);
  toast?.remove();
}

export function mountToastContainer() {
  container = document.getElementById("toast-container");
  if (!container) throw new Error("Missing #toast-container mount point");
}

export function showToast(message, type = "ok") {
  if (!container) throw new Error("Toast components have not been mounted");

  const id = nextToastId++;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.dataset.toastId = String(id);
  toast.setAttribute("role", type === "err" ? "alert" : "status");

  const text = document.createElement("span");
  text.className = "toast-msg";
  text.textContent = String(message);

  const close = document.createElement("button");
  close.className = "toast-close";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss notification");
  close.title = "Dismiss notification";
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-xmark";
  icon.style.fontSize = "16px";
  icon.setAttribute("aria-hidden", "true");
  close.append(icon);
  close.addEventListener("click", () => dismissToast(id));

  toast.append(text, close);
  container.append(toast);
  toastTimers.set(id, setTimeout(() => dismissToast(id), 3000));
}
