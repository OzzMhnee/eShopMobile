import React from 'react';
import { View, Text, Button } from 'react-native';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Tu peux loguer l'erreur ici (ex: Sentry)
    console.log('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 18, marginBottom: 16 }}>
            Une erreur inattendue est survenue : {this.state.error?.message}
          </Text>
          <Button title="Réessayer" onPress={this.handleReset} />
        </View>
      );
    }
    return this.props.children;
  }
}