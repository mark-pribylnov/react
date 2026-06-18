'use client';

import React, { type ErrorInfo } from 'react';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application error boundary caught an error:', error, info);
  }

  private readonly resetBoundary = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback onReset={this.resetBoundary} />;
    }

    return this.props.children;
  }
}
