const notificationTypes = {
  budget: { color: "var(--red)", icon: "fa-money-bill-transfer" },
  recurring: { color: "var(--yellow)", icon: "fa-rotate" },
  goal: { color: "var(--green)", icon: "fa-bullseye" },
  suspicious: { color: "var(--yellow)", icon: "fa-triangle-exclamation" },
  system: { color: "var(--teal)", icon: "fa-wand-magic-sparkles" },
};

let panel = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createIcon(className) {
  const icon = element("i", `fa-solid ${className}`);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function renderNotificationItem(notification, props) {
  const type = notificationTypes[notification.type];
  const item = element(
    "div",
    `notif-item ${notification.read ? "" : "unread"}`,
  );
  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.addEventListener("click", () => props.onMarkRead(notification.id));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      props.onMarkRead(notification.id);
    }
  });

  const typeLabel = element("div", "notif-type");
  typeLabel.style.color = type?.color || "var(--text3)";
  typeLabel.append(
    createIcon(type?.icon || "fa-circle-info"),
    document.createTextNode(` ${notification.type}`),
  );
  item.append(
    typeLabel,
    element("div", "notif-msg", notification.msg),
    element("div", "notif-time", props.timeAgo(notification.time)),
  );
  return item;
}

export function mountNotificationPanel() {
  panel = document.getElementById("notif-panel");
  if (!panel) throw new Error("Missing #notif-panel mount point");
}

export function renderNotificationPanel(props) {
  if (!panel) throw new Error("Notification panel has not been mounted");

  const header = element("div", "notif-header");
  header.append(element("div", "notif-title", "Notifications"));
  header.firstElementChild.id = "notif-title";
  const close = element("button", "notif-close");
  close.type = "button";
  close.setAttribute("aria-label", "Close notifications");
  close.append(createIcon("fa-xmark"));
  close.addEventListener("click", props.onClose);
  header.append(close);

  const list = element("div", "notif-list");
  list.id = "notif-list";
  if (props.notifications.length) {
    list.append(
      ...props.notifications.map((notification) =>
        renderNotificationItem(notification, props),
      ),
    );
  } else {
    const empty = element("div", "", "No notifications yet");
    empty.style.cssText =
      "color:var(--text3);font-size:12px;text-align:center;padding:30px 0";
    list.append(empty);
  }

  const footer = element("div", "notif-footer");
  const permissionButton = element(
    "button",
    `notif-perm-btn${props.permissionGranted ? " granted" : ""}`,
    props.permissionLabel,
  );
  permissionButton.id = "notif-perm-btn";
  permissionButton.addEventListener("click", props.onRequestPermission);
  const clearButton = element("button", "btn btn-ghost", "Clear all");
  clearButton.style.flexShrink = "0";
  clearButton.addEventListener("click", props.onClear);
  footer.append(permissionButton, clearButton);
  panel.replaceChildren(header, list, footer);
}
