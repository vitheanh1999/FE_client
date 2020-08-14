import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import {
  Wrapper, Row, HeaderCell, ButtonOK, BlankFlex,
  ButtonDelete,
} from './settingCardNoTableStyle';
import RefPool from '../../helpers/RefPool';
import CellInput from '../keyboard/CellInput';
import { Blank } from '../campaign/campaignStyle';
import i18n from '../../i18n/i18n';
import { INPUT_TYPE, OPTIONS_BET } from '../../constants/keyboard';
import Keyboard from '../keyboard/Keyboard';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import AutoSave, { AUTO_SAVE_KEY } from '../../helpers/AutoSave';
import { setCursorPos } from '../../helpers/inputUtils';

export const CUSTOM_MODE = {
  LOGIC: 1,
  BET: 2,
};
const GROUP_ROW_NUMBER = 5;
const GROUP_COLOR = ['#cfe2f3', '#d9ead3'];

const COLUMN_SIZE = ['24%', '28%', '24%', '24%'];

class SettingCardNoTable extends Component {
  constructor(props) {
    super(props);
    const {
      cardNoData,
    } = this.props;
    this.state = { cardNoData };
    SettingCardNoTable.instance = this;
    this.refPool = new RefPool();
    this.renderRow = this.renderRow.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.validateCellInput = this.validateCellInput.bind(this);
  }

  getData() {
    const { cardNoData } = this.state;
    return cardNoData;
  }

  componentDidMount() {
    if (AutoSave.instance.checkDraft(AUTO_SAVE_KEY.settingCardNoTable)) {
      const state = AutoSave.instance.getDraftContent(AUTO_SAVE_KEY.settingCardNoTable);
      this.setState(state);
    }
  }

  componentWillUnmount() {
    if (SettingCardNoTable.instance === this) SettingCardNoTable.instance = null;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { cardNoData } = this.state;
    if (newProps && newProps.cardNoData.length > 0 && cardNoData.length === 0) {
      const newData = JSON.parse(JSON.stringify(newProps.cardNoData));
      this.setState({ cardNoData: newData });
    }
  }

  unFocusLastCell(rowIndex, columnIndex) {
    if (rowIndex < 0 || columnIndex < 0) return;
    const refCellInput = this.refPool.getRef(`${rowIndex}-${columnIndex}`);
    if (refCellInput && refCellInput.current) {
      refCellInput.current.unFocus();
    }
  }

  focusCell(rowIndex, columnIndex, textPosition = null) {
    if (rowIndex < 0 || columnIndex < 0) return;
    const refCellInput = this.refPool.getRef(`${rowIndex}-${columnIndex}`).current;
    if (refCellInput) {
      if (refCellInput.getType() === INPUT_TYPE.NUMBER || isMobile) {
        refCellInput.onClickFocus();
      }
      if (refCellInput.refInput.current && textPosition !== null) {
        setCursorPos(refCellInput.refInput.current, textPosition);
      }
    }
  }

  renderHeader() {
    const columnsName = ['customCampaign.cardNo', 'betPoint', 'winNext', 'loseNext'];
    const { mode } = this.props;
    if (mode === CUSTOM_MODE.BET) columnsName[1] = 'betValue';
    return (
      <Row
        backgroundColor="#2d889c"
      >
        <HeaderCell width={COLUMN_SIZE[0]}>{i18n.t(columnsName[0])}</HeaderCell>
        <HeaderCell width={COLUMN_SIZE[1]}>{i18n.t(columnsName[1])}</HeaderCell>
        <HeaderCell width={COLUMN_SIZE[2]}>{i18n.t(columnsName[2])}</HeaderCell>
        <HeaderCell width={COLUMN_SIZE[3]} lastColum>{i18n.t(columnsName[3])}</HeaderCell>
      </Row>
    );
  }

  onSaveDraft() {
    AutoSave.instance.saveDraft(AUTO_SAVE_KEY.settingCardNoTable, this.state);
    const { onSaveDraft } = this.props;
    onSaveDraft();
  }

  onChangeInputCell(columnIndex, columnName, value, rowIndex) {
    // const { onSaveDraft } = this.props;
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.hasAction, true);
    const { cardNoData } = this.state;
    cardNoData[columnIndex][columnName] = value;
    if (columnName === 'bet_value') {
      if (value === 'LOOK') {
        if (cardNoData[columnIndex].win_next) {
          cardNoData[columnIndex].lose_next = cardNoData[columnIndex].win_next;
          this.refPool.getRef(`${columnIndex}-${rowIndex + 2}`).current.setData(cardNoData[columnIndex].win_next);
          this.refPool.getRef(`${columnIndex}-${rowIndex + 2}`).current.validate(cardNoData[columnIndex].win_next);
        }
        if (cardNoData[columnIndex].lose_next) {
          cardNoData[columnIndex].win_next = cardNoData[columnIndex].lose_next;
          this.refPool.getRef(`${columnIndex}-${rowIndex + 1}`).current.setData(cardNoData[columnIndex].lose_next);
          this.refPool.getRef(`${columnIndex}-${rowIndex + 1}`).current.validate(cardNoData[columnIndex].lose_next);
        }
      }
    } else if (cardNoData[columnIndex].bet_value === 'LOOK') {
      cardNoData[columnIndex].win_next = value;
      cardNoData[columnIndex].lose_next = value;
      if (columnName === 'win_next') {
        this.refPool.getRef(`${columnIndex}-${rowIndex + 1}`).current.setData(value);
        this.refPool.getRef(`${columnIndex}-${rowIndex + 1}`).current.validate(value);
      }
      if (columnName === 'lose_next') {
        this.refPool.getRef(`${columnIndex}-${rowIndex - 1}`).current.setData(value);
        this.refPool.getRef(`${columnIndex}-${rowIndex - 1}`).current.validate(value);
      }
    }
    this.setState({ cardNoData }, () => this.onSaveDraft());
    this.refPool.getRef(`${columnIndex}-${rowIndex}`).current.validate(value);
  }

  renderRow(rowData, index) {
    const { mode, settingWorkerData, disabled } = this.props;
    const { cardNoData } = this.state;
    const groupNumber = parseInt(index / GROUP_ROW_NUMBER, 10);
    const groupColor = GROUP_COLOR[groupNumber % 2];
    let placeholder = '';
    if (mode === CUSTOM_MODE.LOGIC) {
      placeholder = i18n.t('placeholder.minValue', { minBetPoint: settingWorkerData.min_bet_point });
    }
    return (
      <Row
        key={rowData.card_no}
        backgroundColor={groupColor}
        color="#000"
      >
        <CellInput
          width={COLUMN_SIZE[0]}
          defaultValue={rowData.card_no}
          ref={this.refPool.getOrCreatRef(`${index}-0`)}
          rowIndex={index}
          columnIndex={0}
          canEdit={false}
          onValidate={this.validateCellInput}
          backgroundColor="#61636175"

        />
        <CellInput
          width={COLUMN_SIZE[1]}
          defaultValue={mode === CUSTOM_MODE.LOGIC ? rowData.bet_point : rowData.bet_value}
          ref={this.refPool.getOrCreatRef(`${index}-1`)}
          rowIndex={index}
          columnIndex={1}
          onChange={(text) => {
            if (mode === CUSTOM_MODE.LOGIC) {
              this.onChangeInputCell(index, 'bet_point', text, 1);
            } else {
              this.onChangeInputCell(index, 'bet_value', text, 1);
            }
          }}
          onValidate={this.validateCellInput}
          type={mode === CUSTOM_MODE.LOGIC ? INPUT_TYPE.NUMBER : INPUT_TYPE.DROP_DOWN}
          maxValue={mode === CUSTOM_MODE.LOGIC ? settingWorkerData.max_bet_point : 0}
          minValue={mode === CUSTOM_MODE.LOGIC ? settingWorkerData.min_bet_point : 10}
          placeholder={placeholder}
          canEdit={!disabled}
        />
        <CellInput
          width={COLUMN_SIZE[2]}
          defaultValue={rowData.win_next}
          ref={this.refPool.getOrCreatRef(`${index}-2`)}
          rowIndex={index}
          columnIndex={2}
          onChange={(text) => {
            this.onChangeInputCell(index, 'win_next', text, 2);
          }}
          onValidate={this.validateCellInput}
          maxValue={cardNoData.length}
          canEdit={!disabled}
        />
        <CellInput
          width={COLUMN_SIZE[3]}
          defaultValue={rowData.lose_next}
          ref={this.refPool.getOrCreatRef(`${index}-3`)}
          rowIndex={index}
          columnIndex={3}
          lastColum
          onChange={(text) => {
            this.onChangeInputCell(index, 'lose_next', text, 3);
          }}
          onValidate={this.validateCellInput}
          maxValue={cardNoData.length}
          canEdit={!disabled}
        />
      </Row>
    );
  }

  addRow() {
    const { settingWorkerData } = this.props;
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.hasAction, true);
    const { cardNoData, mode } = this.state;
    if (cardNoData.length >= settingWorkerData.max_card_no || this.props.disabled) return;
    if (mode === CUSTOM_MODE.LOGIC) {
      cardNoData.push({
        card_no: cardNoData.length + 1,
        bet_point: '',
        lose_next: '',
        win_next: '',
      });
    } else {
      cardNoData.push({
        card_no: cardNoData.length + 1,
        bet_value: OPTIONS_BET[0].value,
        lose_next: '',
        win_next: '',
      });
    }
    this.setState({ cardNoData }, () => {
      const element = document.getElementsByClassName('modal fade show')[0];
      element.scrollTop = element.scrollHeight;
      this.validate(true);
      this.onSaveDraft();
    });
  }

  deleteLastRow() {
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.hasAction, true);
    let { cardNoData } = this.state;
    if (cardNoData.length === 1 || this.props.disabled) return;
    cardNoData = cardNoData.slice(0, cardNoData.length - 1);
    this.setState({ cardNoData }, () => {
      this.validate(true);
      this.onSaveDraft();
    });
  }

  onSaveClick() {
    const { changeMarginBottom } = this.props;
    Keyboard.instance.hideKeyboard();
    changeMarginBottom(0);
    const { onSave } = this.props;
    const { cardNoData } = this.state;
    const haveChangeCardNo = !(JSON.stringify(cardNoData)
      === JSON.stringify(this.props.cardNoData));
    onSave(cardNoData, haveChangeCardNo);
  }

  validate(isFullValidate = false) {
    const { cardNoData } = this.state;
    let isValid = true;
    for (let i = 0; i < cardNoData.length; i += 1) {
      for (let j = 0; j < Object.keys(cardNoData[0]).length; j += 1) {
        this.refPool.getRef(`${i}-${j}`)
          .current.validate(cardNoData[i][Object.keys(cardNoData[0])[j]], isFullValidate);
        if (!this.refPool.getRef(`${i}-${j}`)
          .current.validate(cardNoData[i][Object.keys(cardNoData[0])[j]], isFullValidate)) {
          isValid = false;
        }
      }
    }
    return isValid;
  }

  validateAll() {
    const { cardNoData } = this.state;
    const { mode } = this.props;
    let isValid = true;
    for (let i = 0; i < cardNoData.length; i += 1) {
      for (let j = 0; j < Object.keys(cardNoData[0]).length; j += 1) {
        const cell = this.refPool.getRef(`${i}-${j}`).current;
        const result = (j === 1 && mode === CUSTOM_MODE.LOGIC)
          ? cell.validateAll(cardNoData[i][Object.keys(cardNoData[0])[j]], false)
          : cell.validate(cardNoData[i][Object.keys(cardNoData[0])[j]], false);
        if (!result) {
          isValid = false;
        }
      }
    }
    return isValid;
  }

  validateCellInput(value, columnIndex, isFullValidate) {
    const { cardNoData } = this.state;
    if ((
      !isFullValidate
      && (
        value === undefined
        || value === null
        || value === ''
      ))
      || ([2, 3].includes(columnIndex) && value > cardNoData.length)
    ) {
      return false;
    }
    return true;
  }

  renderFooter() {
    const { cardNoData } = this.state;
    const { settingWorkerData, disabled } = this.props;

    const isDisableAdd = settingWorkerData.max_card_no <= cardNoData.length || disabled;
    const isDisableDelete = cardNoData.length <= 1 || disabled;
    return (
      <React.Fragment>
        <Blank height={0.5} />
        <Row>
          <ButtonDelete
            onClick={() => this.deleteLastRow()}
            isDisableDelete={isDisableDelete}
          >
            {i18n.t('deleteRow')}
          </ButtonDelete>
          <BlankFlex />
          <ButtonOK
            onClick={() => this.addRow()}
            isDisableAdd={isDisableAdd}
          >
            {i18n.t('addRow')}
          </ButtonOK>
          <BlankFlex />
          <ButtonOK onClick={this.onSaveClick}>
            {
              disabled ? i18n.t('ok') : i18n.t('save')
            }
          </ButtonOK>
        </Row>
      </React.Fragment>
    );
  }

  changeMarginBottom(value) {
    const { changeMarginBottom } = this.props;
    changeMarginBottom(value);
  }

  checkChangeData() {
    return !(JSON.stringify(this.state.cardNoData) === JSON.stringify(this.props.cardNoData));
  }

  render() {
    const {
      cardNoData,
    } = this.state;

    return (
      <Wrapper>
        {this.renderHeader()}
        {cardNoData.map(this.renderRow)}
        {this.renderFooter()}
      </Wrapper>
    );
  }
}

SettingCardNoTable.defaultProps = {
  cardNoData: [
    {
      card_no: 1,
      bet_point: '',
      lose_next: '',
      win_next: '',
    },
  ],
  mode: CUSTOM_MODE.LOGIC,
  disabled: false,
};

SettingCardNoTable.propTypes = {
  cardNoData: PropTypes.arrayOf(PropTypes.any),
  onSave: PropTypes.func.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
  mode: PropTypes.number,
  settingWorkerData: PropTypes.any.isRequired,
  changeMarginBottom: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SettingCardNoTable;
