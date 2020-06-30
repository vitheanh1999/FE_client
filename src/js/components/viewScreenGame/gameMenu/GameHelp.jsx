import React, { Component } from 'react';
import styled from 'styled-components';

const HelpContent = styled.div`
  background-color: rgba(255, 255, 255, 1);
  padding: 10px;
`;

class GameHelp extends Component {
  componentDidMount() { }

  render() {
    return (
      <HelpContent>HELP_CONTENT</HelpContent>
    );
  }
}
export default GameHelp;
