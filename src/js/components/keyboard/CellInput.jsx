/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import {
  Wrapper, InputNumber, getWidthHeight,
  getRadius, getBorderWidth, ContentWrapper,
  Icon, InputWrapper, ContentText,
} from './cellInputStyle';
import Keyboard from './Keyboard';
import BlinkPointer from './BlinkPointer';
import { INPUT_TYPE, MOVE_DIRECTION, OPTIONS_BET } from '../../constants/keyboard';
import requiredIcon from '../../../assets/imgs/icons/requiredIcon.png';
import DropDownBetPattern from './DropDownBetPattern';
import { validateFilter, convertFloatText } from '../common/InputFloatField';
import ToastControl from '../common/Toast/ToastControl';
import i18n from '../../i18n/i18n';


const FilterOnlyNumber = '0123456789';

class CellInput extends Component {
  constructor(props) {
    super(props);
    const { defaultValue } = this.props;
    this.state = {
      isFocus: false,
      content: defaultValue,
      invalid: false,
    };
    this.inputChange = this.inputChange.bind(this);
    this.onClickFocus = this.onClickFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.refInput = React.createRef(); // for desktop
    this.refDropdown = React.createRef(); // for dropdown
  }

  componentDidMount() {
  }

  onClickFocus() {
    const {
      rowIndex, columnIndex, canEdit, type,
    } = this.props;
    if (!canEdit) return;
    const { content } = this.state;
    this.setState({ isFocus: true });
    if (Keyboard.instance) {
      if (isMobile) {
        Keyboard.instance.showKeyboard();
      } else if (this.refInput.current) {
        this.refInput.current.focus();
      }
      Keyboard.instance.connectInput(
        rowIndex,
        columnIndex,
        content,
        text => this.inputChange(text),
        type,
        null,
      );
    }
  }

  onKeyDown(event) {
    const { content } = this.state;
    const { keyCode } = event;
    let checkFirst = true;
    if (this.refInput.current) {
      checkFirst = this.refInput.current.selectionStart <= 0;
    }
    let checkLast = true;
    if (this.refInput.current) {
      checkLast = this.refInput.current.selectionStart >= `${content}`.length;
    }

    switch (keyCode) {
      case 37: // left
        if (checkFirst) {
          event.preventDefault();
          Keyboard.instance.onMove(MOVE_DIRECTION.LEFT);
        }
        break;
      case 38: // up
        event.preventDefault();
        Keyboard.instance.onMove(MOVE_DIRECTION.UP);
        break;
      case 39: // right
        if (checkLast) {
          event.preventDefault();
          Keyboard.instance.onMove(MOVE_DIRECTION.RIGHT);
        }
        break;
      case 13: // enter
      case 40: // down
        event.preventDefault();
        Keyboard.instance.onMove(MOVE_DIRECTION.DOWN);
        break;
      default:
        break;
    }
  }

  getData() {
    return this.state.content;
  }

  setData(content) {
    return this.setState({ content });
  }

  unFocus() {
    this.setState({ isFocus: false });
    const { columnIndex, type, minValue } = this.props;
    if (columnIndex === 1 && type === INPUT_TYPE.NUMBER) { // cell bet point
      const { content } = this.state;
      if (content === null || content === undefined) return;
      if (typeof (content) === 'string' && content.length === 0) return;

      const validMin = parseInt(content, 10) >= minValue;
      if (!validMin) this.setState({ invalid: true });
    }
  }

  inputChange(text) {
    const {
      onChange, type, maxValue, enableEqualMax, columnIndex,
    } = this.props;
    if (type === INPUT_TYPE.DROP_DOWN) {
      this.refDropdown.current.selectItemId(
        OPTIONS_BET.find(option => option.value === text).id,
      );
      onChange(text);
      return true;
    }
    const check = validateFilter(text, FilterOnlyNumber);
    if (!check) return false;
    const textValue = convertFloatText(text, 0);
    const floatValue = parseFloat(textValue, 10);
    const value = !isNaN(floatValue) ? Number(floatValue) : '';
    let checkMax = true;
    if (floatValue > maxValue) checkMax = false;
    if (floatValue === maxValue && enableEqualMax === false) checkMax = false;
    if (checkMax) {
      this.setState({ content: value }, () => {
        onChange(value);
        this.validate(value, false);
      });
      return { result: true };
    }
    if ([2, 3].includes(columnIndex)) {
      ToastControl.instance.handleShowToast(i18n.t('invalidCardNo'));
      return { result: false, type: 'other' };
    }
    ToastControl.instance.handleShowToast(i18n.t('invalidBetPoint').replace('param', maxValue));
    return { result: false, type: 'betPoint', maxValue };
  }

  validate(value, isFullValidate) {
    const { onValidate, columnIndex } = this.props;
    const validRequireAndCardNo = onValidate(value, columnIndex, isFullValidate);
    this.setState({
      invalid: !validRequireAndCardNo,
    });
    return validRequireAndCardNo;
  }

  validateAll(value) {
    const { onValidate, columnIndex, minValue } = this.props;
    const validRequireAndCardNo = onValidate(value, columnIndex, true);
    const validMin = value >= minValue;
    this.setState({
      invalid: !(validRequireAndCardNo && validMin),
    });
    return (validRequireAndCardNo && validMin);
  }

  getType() {
    const { type } = this.props;
    return type;
  }

  renderDesktop() {
    const { content, invalid } = this.state;
    const { type, canEdit, placeholder } = this.props;
    if (type === INPUT_TYPE.DROP_DOWN) return this.renderDropDown();

    return (
      <InputWrapper>
        <InputNumber
          value={content}
          onChange={(event) => {
            this.inputChange(event.target.value);
          }}
          onFocus={this.onClickFocus}
          autoComplete="off"
          onKeyDown={this.onKeyDown}
          ref={this.refInput}
          disabled={!canEdit}
          onBlur={() => this.unFocus()}
          placeholder={placeholder}
          invalid={invalid}
        />
        {invalid && <Icon src={requiredIcon} />}
      </InputWrapper>
    );
  }

  renderMobile() {
    const { content, isFocus, invalid } = this.state;
    const { type, placeholder } = this.props;
    if (type === INPUT_TYPE.DROP_DOWN) return this.renderDropDown();
    let isShowPlaceholder = false;
    if (content === undefined || content === null || content.length === 0) isShowPlaceholder = true;
    if (isFocus) isShowPlaceholder = false;

    return (
      <ContentWrapper
        onClick={this.onClickFocus}
        isFocus={isFocus}
        invalid={invalid}
      >
        <ContentText isShowPlaceholder={isShowPlaceholder}>
          {
            isShowPlaceholder ? placeholder : content
          }
        </ContentText>
        {
          isFocus && <BlinkPointer visible />
        }
        {invalid && <Icon src={requiredIcon} />}
      </ContentWrapper>
    );
  }

  renderDropDown() {
    const { content } = this.state;
    const fullSize = {
      width: '100%',
      height: '100%',
    };
    return (
      <DropDownBetPattern
        data={OPTIONS_BET}
        onChangeSelected={(id, info) => {
          this.inputChange(info.value);
        }}
        defaultSelectedId={OPTIONS_BET.find(option => option.value === content).id}
        customStyle={fullSize}
        currentSelectedStyle={fullSize}
        customItemStyle={fullSize}
        ref={this.refDropdown}
        onClick={() => this.onClickFocus()}
        onKeyDown={this.onKeyDown}
        isDisable={!this.props.canEdit}
      />
    );
  }

  render() {
    const {
      backgroundColor, customStyle, width, height,
      flex, fontSize, lastColum, canEdit,
    } = this.props;
    const { isFocus } = this.state;
    return (
      <Wrapper
        width={getWidthHeight(width)}
        height={getWidthHeight(height)}
        style={customStyle}
        backgroundColor={backgroundColor}
        flex={flex}
        fontSize={getWidthHeight(fontSize)}
        borderRadius={getRadius(fontSize)}
        borderWidth={getBorderWidth(fontSize)}
        isFocus={isFocus}
        lastColum={lastColum}
        canEdit={canEdit}
      >
        {isMobile ? this.renderMobile() : this.renderDesktop()}
      </Wrapper>
    );
  }
}

CellInput.defaultProps = {
  backgroundColor: '#fff0',
  customStyle: {},
  width: -1,
  height: isMobile ? 2.5 : 2,
  flex: false,
  fontSize: 1,
  lastColum: false,
  defaultValue: '',
  canEdit: true,
  onChange: null,
  type: INPUT_TYPE.NUMBER,
  minValue: 1,
  maxValue: 1000000000,
  enableEqualMin: true,
  enableEqualMax: true,
  placeholder: '',
};

CellInput.propTypes = {
  backgroundColor: PropTypes.string,
  customStyle: PropTypes.objectOf(PropTypes.any),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flex: PropTypes.bool,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastColum: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowIndex: PropTypes.number.isRequired,
  columnIndex: PropTypes.number.isRequired,
  canEdit: PropTypes.bool,
  onChange: PropTypes.func,
  onValidate: PropTypes.func.isRequired,
  type: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  enableEqualMin: PropTypes.bool,
  enableEqualMax: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CellInput;
