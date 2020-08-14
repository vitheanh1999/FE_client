import React from 'react';
import KeyboardLogic from './KeyboardLogic';
import {
  PanelRoot, Wrapper, Row, Column, WrapperContent,
} from './keyBoardStyle';
import ContentRow from './ContentRow';
import Key from './Key';
import { ORIENTATION, checkOrientation } from '../../helpers/system';
import { INPUT_TYPE, MOVE_DIRECTION, OPTIONS_BET } from '../../constants/keyboard';
import SettingCardNoTable from '../customCampaign/SettingCardNoTable';

const getRootFontSize = (orient) => { // only for mobile
  if (orient === ORIENTATION.Portrait) {
    const keyboardWidth = window.innerWidth;
    const fonSize = keyboardWidth / 768 * 16;
    return fonSize;
  }
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const keyBoardWidth = (screenHeight * 1.4538) <= screenWidth
    ? screenHeight * 1.4538 : screenWidth;
  const fonSize = keyBoardWidth / 1027 * 17;
  return fonSize;
};

class Keyboard extends KeyboardLogic {
  constructor(props) {
    super(props);
    this.state = {
      orient: checkOrientation(),
      numberValue: null,
      isShowKeyBoard: false,
      inputRow: -1,
      inputColumn: -1,
      maxLength: 15,
    };
    Keyboard.instance = this;
    this.onBackDelete = this.onBackDelete.bind(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (Keyboard.instance === this) Keyboard.instance = null;
  }

  onOrientationChange() {
    const orient = checkOrientation();
    this.hideKeyboard();
    this.setState({
      orient,
    });
  }

  onBackDelete() {
    const { inputOnChange, numberValue } = this.state;
    let textValue = `${numberValue}`;
    if (numberValue === null || textValue.length === 0) return;
    textValue = textValue.slice(0, textValue.length - 1);
    const value = textValue.length === 0 ? '' : parseInt(textValue, 10);
    inputOnChange(value);
    this.setState({ numberValue: value });
  }

  onPressKey(character) {
    const { numberValue, inputOnChange, typeInput } = this.state;
    if (typeInput === INPUT_TYPE.DROP_DOWN) {
      inputOnChange(character); // character = 'P', 'B', 'LOOK'
      this.setState({ numberValue: character });
      return;
    }
    const textValue = `${numberValue || ''}${character}`;
    if (inputOnChange(textValue).result) {
      this.setState({ numberValue: textValue });
    }
  }

  showKeyboard() {
    this.setState({ isShowKeyBoard: true });
    const keyBoardHeight = this.getKeyboardHeight();
    SettingCardNoTable.instance.changeMarginBottom(keyBoardHeight);
  }

  hideKeyboard() {
    this.setState({ isShowKeyBoard: false });
    if (SettingCardNoTable.instance) SettingCardNoTable.instance.changeMarginBottom(0);
    this.disConnectInput();
  }

  connectInput(inputRow, inputColumn, currentValue, inputOnChange,
    typeInput = INPUT_TYPE.NUMBER, onValidate = null) {
    const { state } = this;
    if (inputRow !== state.inputRow || inputColumn !== state.inputColumn) {
      SettingCardNoTable.instance.unFocusLastCell(state.inputRow, state.inputColumn);
    }
    this.setState({
      inputRow,
      inputColumn,
      numberValue: currentValue,
      inputOnChange,
      typeInput,
      onValidate,
    });
  }

  disConnectInput() {
    const { state } = this;
    if (SettingCardNoTable.instance) {
      SettingCardNoTable.instance.unFocusLastCell(state.inputRow, state.inputColumn);
    }
    this.setState({
      inputRow: -1,
      inputColumn: -1,
      inputOnChange: () => { },
      typeInput: INPUT_TYPE.NUMBER,
      onMove: null,
      numberValue: null,
      isShowKeyBoard: false,
    });
    SettingCardNoTable.instance.changeMarginBottom(0);
  }

  onMove(direction) {
    let { inputRow, inputColumn } = this.state;
    let textPosition = null;
    switch (direction) {
      case MOVE_DIRECTION.UP:
        inputRow -= 1;
        textPosition = 99999;
        break;
      case MOVE_DIRECTION.DOWN:
        inputRow += 1;
        textPosition = 99999;
        break;
      case MOVE_DIRECTION.LEFT:
        if (inputColumn > 1) {
          inputColumn -= 1;
          textPosition = 99999;
        } else {
          return;
        }
        break;
      case MOVE_DIRECTION.RIGHT:
        if (inputColumn < 3) {
          inputColumn += 1;
          textPosition = 0;
        } else {
          return;
        }
        break;
      default:
    }
    SettingCardNoTable.instance.focusCell(inputRow, inputColumn, textPosition);
  }

  onSave(e) {
    this.disConnectInput();
    e.preventDefault();
  }

  renderPortraitKeyBetPattern() {
    return (
      <React.Fragment>
        <WrapperContent>
          <div style={{ width: '75vw' }}>
            <Row flex={1} style={{ height: '50%' }}>
              <Key
                flex={0}
                width="25vw"
                onClick={() => this.onPressKey(OPTIONS_BET[0].value)}
                backgroundColor="#d4142675"
                color="#000"
              >
                BANKER
              </Key>
              <Key
                flex={0}
                width="25vw"
                onClick={() => this.onPressKey(OPTIONS_BET[1].value)}
                backgroundColor="#007bff73"
                color="#000"
              >
                PLAYER
              </Key>
              <Key flex={0} width="25vw" onClick={() => this.onPressKey(OPTIONS_BET[2].value)} color="#000">LOOK</Key>
            </Row>
            <Row flex={1} style={{ height: '50%' }}>
              <Key
                backgroundColor="#23b083"
                flex={1}
                width="75vw"
                onTouchEnd={e => this.onSave(e)}
              >
                OK
              </Key>
            </Row>
          </div>
          <div style={{ width: '25vw' }}>
            <Row flex={1} style={{ height: '100%' }}>
              <Column flex={1}>
                <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.UP)}>↑</Key>
                <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.DOWN)}>↓</Key>
                <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.LEFT)}>←</Key>
                <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.RIGHT)}>→</Key>
              </Column>
            </Row>
          </div>
        </WrapperContent>
      </React.Fragment>
    );
  }

  renderPortraitKeyLogicPattern() {
    return (
      <React.Fragment>
        <Row flex={1}>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(1)}>1</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(2)}>2</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(3)}>3</Key>
          <Key flex={0} width="25%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.UP)}>↑</Key>
        </Row>
        <Row flex={1}>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(4)}>4</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(5)}>5</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(6)}>6</Key>
          <Key flex={0} width="25%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.DOWN)}>↓</Key>
        </Row>
        <Row flex={1}>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(7)}>7</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(8)}>8</Key>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(9)}>9</Key>
          <Key flex={0} width="25%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.LEFT)}>←</Key>
        </Row>
        <Row flex={2}>
          <Key flex={0} width="25%" onClick={() => this.onPressKey(0)}>0</Key>
          <Key
            flex={0}
            width="50%"
            onTouchEnd={(e) => {
              this.onSave(e);
            }}
            backgroundColor="#23b083"
          >OK
          </Key>
          <Key flex={0} width="25%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.RIGHT)}>→</Key>
        </Row>
      </React.Fragment>
    );
  }

  renderPortrait() {
    const keyBoardWidth = '100vw';

    const { numberValue, typeInput } = this.state;
    let disableDelete = (numberValue === undefined || numberValue === null);
    if (typeof (numberValue) === 'string' && numberValue.length === 0) {
      disableDelete = true;
    }
    let optionBet = null;
    if (typeInput === INPUT_TYPE.DROP_DOWN) {
      optionBet = OPTIONS_BET.find(option => option.value === numberValue).text;
      disableDelete = true;
    }
    return (
      <Wrapper
        width={keyBoardWidth}
      >
        <ContentRow
          height="8.92vw"
          textContent={typeInput === INPUT_TYPE.NUMBER ? numberValue : optionBet}
          onBackDelete={this.onBackDelete}
          disableDelete={disableDelete}
        />
        {
          typeInput === INPUT_TYPE.NUMBER
            ? this.renderPortraitKeyLogicPattern() : this.renderPortraitKeyBetPattern()
        }
      </Wrapper>
    );
  }

  renderLandscapeKeyLogicPattern() {
    return (
      <React.Fragment>
        <Row flex={1}>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(1)}>1</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(2)}>2</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(3)}>3</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(4)}>4</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(5)}>5</Key>
          <Key flex={0} width="16.667%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.RIGHT)}>→</Key>
        </Row>
        <Row flex={1}>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(6)}>6</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(7)}>7</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(8)}>8</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(9)}>9</Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(0)}>0</Key>
          <Key flex={0} width="16.667%" lastColumn onClick={() => this.onMove(MOVE_DIRECTION.LEFT)}>←</Key>
        </Row>
        <Row flex={2}>
          <Key flex={0} width="33.333%" onClick={() => this.onMove(MOVE_DIRECTION.UP)}>↑</Key>
          <Key flex={0} width="33.333%" onClick={() => this.onMove(MOVE_DIRECTION.DOWN)}>↓</Key>
          <Key flex={0} width="33.333%" lastColumn onTouchEnd={e => this.onSave(e)} backgroundColor="#23b083">OK</Key>
        </Row>
      </React.Fragment>
    );
  }

  renderLandscapeKeyBetPattern() {
    return (
      <React.Fragment>
        <Row flex={2}>
          <Key
            flex={0}
            width="33.333%"
            onClick={() => this.onPressKey(OPTIONS_BET[0].value)}
            backgroundColor="#d4142675"
            color="#000"
          >
            BANKER
          </Key>
          <Key
            flex={0}
            width="33.333%"
            onClick={() => this.onPressKey(OPTIONS_BET[1].value)}
            backgroundColor="#007bff73"
            color="#000"
          >
            PLAYER
          </Key>
          <Key flex={0} width="16.667%" onClick={() => this.onPressKey(OPTIONS_BET[2].value)} color="#000">LOOK</Key>
          <Column flex={1}>
            <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.RIGHT)}>→</Key>
            <Key flex={1} lastColumn onClick={() => this.onMove(MOVE_DIRECTION.LEFT)}>←</Key>
          </Column>
        </Row>
        <Row flex={1}>
          <Key flex={0} width="33.333%" onClick={() => this.onMove(MOVE_DIRECTION.UP)}>↑</Key>
          <Key flex={0} width="33.333%" onClick={() => this.onMove(MOVE_DIRECTION.DOWN)}>↓</Key>
          <Key flex={0} width="33.333%" lastColumn onTouchEnd={e => this.onSave(e)} backgroundColor="#23b083">OK</Key>
        </Row>
      </React.Fragment>
    );
  }

  renderLandscape() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const keyBoardWidth = (screenHeight * 1.4538) <= screenWidth ? '145.38vh' : '100vw';
    const { numberValue, typeInput } = this.state;
    let disableDelete = (numberValue === undefined || numberValue === null);
    if (typeof (numberValue) === 'string' && numberValue.length === 0) {
      disableDelete = true;
    }
    let optionBet = null;
    if (typeInput === INPUT_TYPE.DROP_DOWN) {
      optionBet = OPTIONS_BET.find(option => option.value === numberValue).text;
      disableDelete = true;
    }

    return (
      <Wrapper
        width={keyBoardWidth}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        <ContentRow
          height="27.89%"
          textContent={typeInput === INPUT_TYPE.NUMBER ? numberValue : optionBet}
          onBackDelete={this.onBackDelete}
          disableDelete={disableDelete}
        />
        {
          typeInput === INPUT_TYPE.NUMBER
            ? this.renderLandscapeKeyLogicPattern() : this.renderLandscapeKeyBetPattern()
        }
      </Wrapper>
    );
  }

  getKeyboardHeight() {
    const { orient } = this.state;
    let keyBoardHeight = 0; // orient === ORIENTATION.Landscape ? '36.49vh' : '43vw';

    if (orient === ORIENTATION.Landscape) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      keyBoardHeight = (screenHeight * 1.4538) <= screenWidth ? '40.49vh' : '28.1vw';
    } else {
      keyBoardHeight = '48vw';
    }
    return keyBoardHeight;
  }

  render() {
    const { orient, isShowKeyBoard } = this.state;
    if (!isShowKeyBoard) return null;

    const keyBoardHeight = this.getKeyboardHeight();

    const content = orient === ORIENTATION.Landscape
      ? this.renderLandscape() : this.renderPortrait();
    return (
      <PanelRoot
        id="PanelRoot"
        height={keyBoardHeight}
        fontSize={getRootFontSize(orient)}
      >
        {content}
      </PanelRoot>
    );
  }
}

export default Keyboard;
