import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonAdd, Message, WrapperInput, ErrorTextSelectTable,
} from '../../mainContainer/mainStyle';
import i18n from '../../../i18n/i18n';
import { images } from '../../../theme';
import Dropdown from './Dropdown';
import { Name } from '../../botDetail/BotDetailStyle';
import Alert from '../Alert/Alert';
import ApiErrorUtils from '../../../helpers/ApiErrorUtils';

class DropDownTextField extends Component {
  constructor(props) {
    super(props);

    const { optionDefault, isShowDropdown } = this.props;
    this.state = {
      isShowDropdown,
      optionSelected: { ...optionDefault },
      messageError: '',
    };

    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleSubmitOption = this.handleSubmitOption.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isShowDropdown: false });
    }
  }

  openDropdown() {
    const { isChangeOptionName, handleChangeProps } = this.props;
    this.setState({ isShowDropdown: true });
    handleChangeProps(true, isChangeOptionName);
  }

  handleChangeOption(id, option) {
    const {
      handleChangeProps, isValidOptionName,
      isError, messageError,
      handleChangeValue,
    } = this.props;
    if (option.isError) {
      this.setState({ messageError });
    } else if (messageError !== '') {
      this.setState({ messageError: '' });
    }
    if (option.isFull === true) {
      this.setState({ messageError: i18n.t('tableIsFull') });
      handleChangeProps(true, 'isTableFull');
      return;
    }
    handleChangeProps(false, 'isTableFull');
    if (isError) {
      handleChangeProps(true, isValidOptionName);
      this.openDropdown();
    }
    const optionSelected = { id: option.value, name: option.text };
    handleChangeValue(optionSelected);
    this.setState({ optionSelected });
  }

  handleSubmitOption() {
    const {
      submitOption, optionDefault,
      handleChangeProps, idDefault,
      isChangeOptionName, isValidOptionName,
    } = this.props;
    const { optionSelected, messageError } = this.state;
    if (optionSelected.id === '' || optionSelected.id === undefined || optionSelected.id === null) {
      this.setState({ messageError: i18n.t('fieldIsRequire') });
      return;
    }
    const checkSubmit = idDefault
      ? optionDefault.id !== optionSelected.id : idDefault !== optionSelected.id;
    if (messageError === '') {
      handleChangeProps(false, isChangeOptionName);
      if (optionSelected && optionSelected.id && checkSubmit) {
        submitOption(optionSelected);
        this.setState({ isShowDropdown: false });
      } else {
        this.setState({ isShowDropdown: false });
      }
      handleChangeProps(true, isValidOptionName);
    }
  }

  renderOptionName() {
    const { isChangeOption, optionDefault } = this.props;
    return (
      <Fragment>
        <span>{optionDefault && optionDefault.name}</span>
        {isChangeOption ? (
          <ButtonAdd
            fontSize="1em"
            hoverBgColor="#2d889c"
            height="2em"
            width="2em"
            margin="0 0 0 0.5em"
            bgrImage={images.editWhite}
            onClick={() => this.openDropdown()}
          />
        ) : ''
        }
      </Fragment>
    );
  }

  renderDropdownOption() {
    const {
      listOption, optionDefault,
      isError, fontSize,
      convertDataOption,
    } = this.props;
    const { isShowDropdown, messageError } = this.state;
    const optionList = convertDataOption(listOption, fontSize);
    const elementMessage = (
      <Message fontSize="0.7em">
        <p>{isShowDropdown ? i18n.t('pleaseSaveField') : i18n.t('fieldRequired')}</p>
      </Message>
    );
    const elementMessageError = (
      <Message fontSize="0.7em">
        <ErrorTextSelectTable>{messageError}</ErrorTextSelectTable>
      </Message>
    );
    return (
      <div>
        <WrapperInput id="SelectTable">
          <Dropdown
            data={optionList.dataOption}
            onChangeSelected={this.handleChangeOption}
            defaultSelectedId={optionDefault && optionDefault.id}
            heightOptions={10}
            width={optionList.maxLength}
          />
          <ButtonAdd
            fontSize="1em"
            hoverBgColor="#23B083"
            opacity="0.5"
            height="2em"
            width="2em"
            margin="0 0 0 0.5em"
            bgrImage={images.saveWhite}
            onClick={() => this.handleSubmitOption()}
          />
        </WrapperInput>
        {
          isError ? elementMessage : elementMessageError
        }
      </div>
    );
  }

  render() {
    const { isError, fontSize } = this.props;
    const { isShowDropdown } = this.state;
    return (
      <Name fontSize={fontSize}>
        {isShowDropdown || isError ? this.renderDropdownOption() : (this.renderOptionName())}
      </Name>
    );
  }
}

DropDownTextField.defaultProps = {
  optionDefault: {
    id: '',
    name: '',
  },
  isChangeOption: false,
  isError: false,
  fontSize: 0,
  messageError: '',
  isShowDropdown: false,
  handleChangeValue: () => { },
};

DropDownTextField.propTypes = {
  idDefault: PropTypes.number.isRequired,
  isShowDropdown: PropTypes.bool,
  optionDefault: PropTypes.objectOf(PropTypes.any),
  submitOption: PropTypes.func.isRequired,
  handleChangeValue: PropTypes.func,
  isChangeOption: PropTypes.bool,
  listOption: PropTypes.array.isRequired,
  isError: PropTypes.bool,
  handleChangeProps: PropTypes.func.isRequired,
  titleSubmit: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  convertDataOption: PropTypes.func.isRequired,
  isChangeOptionName: PropTypes.string.isRequired,
  isValidOptionName: PropTypes.string.isRequired,
  messageError: PropTypes.string,
};

export default DropDownTextField;
