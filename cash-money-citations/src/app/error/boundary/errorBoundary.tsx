'use client';

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean}> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return  <h1>An error has occured!</h1>
        }

        return this.props.children;
    }
}