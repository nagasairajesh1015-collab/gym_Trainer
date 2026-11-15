import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="page"><div className="card">
        <h3>Something went wrong</h3>
        <p className="muted">{String(this.state.error.message)}</p>
        <button className="btn primary" style={{ marginTop: '1rem' }} onClick={() => this.setState({ error: null })}>Try again</button>
      </div></main>
    );
  }
}
