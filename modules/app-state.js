const listeners = new Set();
let state = {
  activePage: "dashboard",
  dashboard: null,
  notifications: [],
};

function updateState(updater) {
  const nextState = updater(state);
  if (nextState === state) return;
  state = nextState;
  listeners.forEach((listener) => listener());
}

export function getAppState() {
  return state;
}

export function subscribeToAppState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setActivePage(activePage) {
  updateState((current) =>
    current.activePage === activePage
      ? current
      : { ...current, activePage },
  );
}

export function setDashboardState(dashboard) {
  updateState((current) =>
    current.dashboard === dashboard
      ? current
      : { ...current, dashboard },
  );
}

export function setNotificationState(notifications) {
  updateState((current) =>
    current.notifications === notifications
      ? current
      : { ...current, notifications },
  );
}
