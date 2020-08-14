import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const LogRecord = styled.div`
  width: 100%;
  border-top: 2px gray solid;
  padding-top: 0.1em;
  padding-bottom: 1em;
  color: ${props => props.color};
  white-space: break-spaces;
  position: relative;
`;

export const ButtonExpand = styled.div`
  color: blue;
  padding-left: 0.5em;
  position: absolute;
  top: 0.2em;
  right: 0.5em;
  background-color: aqua;
  opacity: 0.7;
  border-radius: 1em;
  padding-right: 0.5em;
`;

class LogItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowFullContent: false };
  }

  render() {
    const { content } = this.props;
    const { isShowFullContent } = this.state;
    return (
      <LogRecord
        color={content[0] === 'error:' ? 'red' : 'white'}
      >
        {
          isShowFullContent ? content.toString() : content.toString().substring(0, 100)
        }
        <ButtonExpand onClick={() => this.setState({ isShowFullContent: !isShowFullContent })}>
          { isShowFullContent ? 'show less' : 'expand'}
        </ButtonExpand>
      </LogRecord>
    );
  }
}

LogItem.propTypes = {
  content: PropTypes.object.isRequired,
};

export default LogItem;
