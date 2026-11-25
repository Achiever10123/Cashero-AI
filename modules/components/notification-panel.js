import {
  createElement,
  Fragment,
  useSyncExternalStore,
} from "react";
import {
  getAppState,
  setNotificationState,
  subscribeToAppState,
} from "../app-state.js";
import { createBoundaryRoot } from "./create-boundary-root.js";

let root = null;

const notificationTypes = {
  budget: { color: "var(--red)", icon: "fa-money-bill-transfer" },
  recurring: { color: "var(--yellow)", icon: "fa-rotate" },
  goal: { color: "var(--green)", icon: "fa-bullseye" },
  suspicious: { color: "var(--yellow)", icon: "fa-triangle-exclamation" },
  system: { color: "var(--teal)", icon: "fa-wand-magic-sparkles" },
};

function NotificationPanel({
  onClose,
  onClear,
  onMarkRead,
  onRequestPermission,
  timeAgo,
  permissionLabel,
  permissionGranted,
}) {
  const { notifications } = useSyncExternalStore(
    subscribeToAppState,
    getAppState,
  );

  return createElement(
    Fragment,
    null,
    createElement(
      "div",
      { className: "notif-header" },
      createElement("div", { className: "notif-title", id: "notif-title" }, "Notifications"),
      createElement(
        "button",
        {
          className: "notif-close",
          type: "button",
          "aria-label": "Close notifications",
          onClick: onClose,
        },
        createElement("i", {
          className: "fa-solid fa-xmark",
          "aria-hidden": true,
        }),
      ),
    ),
    createElement(
      "div",
      { className: "notif-list", id: "notif-list" },
      notifications.length
        ? notifications.map((notification) => {
            const type = notificationTypes[notification.type];
            return createElement(
              "div",
              {
                className: `notif-item ${notification.read ? "" : "unread"}`,
                onClick: () => onMarkRead(notification.id),
                key: notification.id,
              },
              createElement(
                "div",
                {
                  className: "notif-type",
                  style: { color: type?.color || "var(--text3)" },
                },
                createElement("i", {
                  className: `fa-solid ${type?.icon || "fa-circle-info"}`,
                  "aria-hidden": true,
                }),
                ` ${notification.type}`,
              ),
              createElement("div", { className: "notif-msg" }, notification.msg),
              createElement(
                "div",
                { className: "notif-time" },
                timeAgo(notification.time),
              ),
            );
          })
        : createElement(
            "div",
            {
              style: {
                color: "var(--text3)",
                fontSize: "12px",
                textAlign: "center",
                padding: "30px 0",
              },
            },
            "No notifications yet",
          ),
    ),
    createElement(
      "div",
      { className: "notif-footer" },
      createElement(
        "button",
        {
          className: `notif-perm-btn${permissionGranted ? " granted" : ""}`,
          id: "notif-perm-btn",
          onClick: onRequestPermission,
        },
        permissionLabel,
      ),
      createElement(
        "button",
        {
          className: "btn btn-ghost",
          onClick: onClear,
          style: { flexShrink: 0 },
        },
        "Clear all",
      ),
    ),
  );
}

export function mountNotificationPanel() {
  const panel = document.getElementById("notif-panel");
  if (!panel) throw new Error("Missing #notif-panel mount point");
  if (root) return;
  root = createBoundaryRoot(panel, "Could not render notifications");
}

export function renderNotificationPanel(props) {
  if (!root) throw new Error("Notification panel has not been mounted");
  setNotificationState(props.notifications);
  root.render(createElement(NotificationPanel, props));
}
