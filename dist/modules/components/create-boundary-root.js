import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { reportError } from "../errors.js";
import { ComponentErrorBoundary } from "./error-boundary.js";

export function createBoundaryRoot(container, context) {
  if (!container) throw new Error(`Missing React mount point for ${context}`);

  const root = createRoot(container);
  return {
    render(node) {
      root.render(
        createElement(
          ComponentErrorBoundary,
          {
            onError: (error, info) => {
              const reportedError = new Error(error.message, { cause: error });
              reportedError.stack = `${reportedError.stack}\nReact component stack:${
                info.componentStack || ""
              }`;
              reportError(reportedError, context);
            },
          },
          node,
        ),
      );
    },
  };
}
