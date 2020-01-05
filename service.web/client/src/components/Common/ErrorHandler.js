import React from 'react'
import { Link } from 'react-router-dom'

class ErrorHandler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>
            Something went Wrong
          </p>
          <Link to={'/'} onClick={() => this.setState({ hasError: false })}>
            go back
          </Link>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorHandler