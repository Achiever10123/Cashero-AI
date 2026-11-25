import assert from "node:assert/strict";
import test from "node:test";
import {
  getAppState,
  setActivePage,
  setDashboardState,
  setNotificationState,
  subscribeToAppState,
} from "../modules/app-state.js";

test("shared app state notifies subscribers and supports unsubscribe", () => {
  const snapshots = [];
  const unsubscribe = subscribeToAppState(() => snapshots.push(getAppState()));

  const dashboard = { spentLabel: "$12.00" };
  const notifications = [{ id: 1, msg: "Budget alert" }];
  setActivePage("history");
  setDashboardState(dashboard);
  setNotificationState(notifications);
  unsubscribe();
  setActivePage("settings");

  assert.equal(snapshots.length, 3);
  assert.equal(snapshots[0].activePage, "history");
  assert.equal(snapshots[1].dashboard, dashboard);
  assert.equal(snapshots[2].notifications, notifications);
  assert.equal(getAppState().activePage, "settings");
});
