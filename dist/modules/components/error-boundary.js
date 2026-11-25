import { Component, createElement, Fragment } from "react";

export class ComponentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.props.onError(error, info);
  }

  render() {
    if (this.state.error) {
      return createElement(
        "section",
        { role: "alert", className: "component-error" },
        createElement(
          "p",
          null,
          this.props.fallbackMessage ||
            "This section could not be displayed.",
        ),
        createElement(
          "button",
          {
            className: "btn btn-ghost",
            type: "button",
            onClick: () =>
              this.setState(({ resetKey }) => ({
                error: null,
                resetKey: resetKey + 1,
              })),
          },
          "Try again",
        ),
      );
    }

    return createElement(
      Fragment,
      { key: this.state.resetKey },
      this.props.children,
    );
  }
}
