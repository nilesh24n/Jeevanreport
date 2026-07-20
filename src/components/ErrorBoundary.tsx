"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card p-6 border-red-100 bg-red-50/50 text-center my-4">
            <span className="text-2xl" role="img" aria-label="Warning">⚠️</span>
            <h2 className="text-base font-bold text-red-900 mt-2">Something went wrong in this section</h2>
            <p className="text-xs text-red-700 mt-1">We couldn&apos;t load this component. Please try reloading the page.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
