import React, { type ErrorInfo } from 'react';

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
      return (
        <div className="app-container">
          <section className="error-boundary-fallback">
            <h2>Something went wrong</h2>
            <p>
              The app hit an unexpected error. You can try resetting it and
              continue using the app.
            </p>
            <button className="search-button" type="button" onClick={this.resetBoundary}>
              Reset application
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
