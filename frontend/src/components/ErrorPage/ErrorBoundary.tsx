import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface ErrorBoundaryProps {
    children: ReactNode;
    // Changing this (e.g. the current path) clears the error, so navigating away recovers the app
    resetKey?: string;
}

interface ErrorBoundaryState {
    error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {};

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Unhandled UI error:', error, info.componentStack);
    }

    componentDidUpdate(previousProps: ErrorBoundaryProps) {
        if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
            this.setState({ error: undefined });
        }
    }

    render() {
        if (this.state.error) {
            return <ErrorPage error={this.state.error} reset={() => this.setState({ error: undefined })} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
