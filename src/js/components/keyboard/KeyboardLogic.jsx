import React, { Component } from 'react';
import { checkOrientation } from '../../helpers/system';

class KeyboardLogic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orient: checkOrientation(),
    };
    this.onOrientationChange = this.onOrientationChange.bind(this);
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }

  onOrientationChange() {
    const orient = checkOrientation();
    this.setState({
      orient,
    });
  }

  render() {
    const { orient } = this.state;
    return (
      <div>{orient}</div>
    );
  }
}

KeyboardLogic.defaultProps = {
};

KeyboardLogic.propTypes = {
};

export default KeyboardLogic;
