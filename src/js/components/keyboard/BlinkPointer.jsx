import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const defaultChar = '_';

class BlinkPointer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { content: defaultChar };
    this.interVal = null;
  }

  componentDidMount() {
    this.interVal = setInterval(() => {
      const { content } = this.state;
      this.setState({ content: content === defaultChar ? '' : defaultChar });
    }, 450);
  }

  componentWillUnmount() {
    if (this.interVal) clearInterval(this.interVal);
  }

  render() {
    const { visible } = this.props;
    const { content } = this.state;
    if (!visible) return null;
    return (<span>{content}</span>);
  }
}


BlinkPointer.defaultProps = {
  visible: false,
};

BlinkPointer.propTypes = {
  visible: PropTypes.bool,
};

export default BlinkPointer;
