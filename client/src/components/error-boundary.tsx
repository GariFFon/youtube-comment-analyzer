import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-card-gradient border-0 shadow-xl rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  An unexpected error occurred while analyzing the video.
                </p>
                {this.state.error && (
                  <details className="text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                      Error Details
                    </summary>
                    <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto">
                      {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          {'\n\n'}
                          {this.state.error.stack}
                        </>
                      )}
                    </pre>
                  </details>
                )}
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                  variant="youtube"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button 
                  onClick={() => this.setState({ hasError: false, error: undefined })} 
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
