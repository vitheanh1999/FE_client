import React, { Component } from 'react';
import {
  RootContainer,
} from './testScreenStyle';
import Keyboard from '../../components/keyboard/Keyboard';
import SettingCardNoTable from '../../components/customCampaign/SettingCardNoTable';

class TestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <RootContainer>
        <SettingCardNoTable />
        <Keyboard />
      </RootContainer>
    );
  }
}

TestScreen.defaultProps = {
};

TestScreen.propTypes = {
};

export default TestScreen;
