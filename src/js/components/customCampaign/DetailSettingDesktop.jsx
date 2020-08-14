// import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { isMobile } from 'react-device-detect';
// import {
//   WrapperDetail, FooterWrapper, ButtonOK,
//   ButtonRevert, Blank,
// } from '../campaign/campaignStyle';
// import { Column, Wrapper } from './detailSettingDesktopStyle';
// import Spinner from '../common/Spinner';
// import i18n from '../../i18n/i18n';
// import Alert from '../common/Alert/Alert';
// import ApiErrorUtils from '../../helpers/ApiErrorUtils';
// import {
//   TitleGroup, renderButtonHelp, Row,
// } from '../campaign/detail/tabBasicSettingStyle';
// import HelpCampaign from '../campaign/detail/HelpCampaign';
// import FormCampaign from '../campaign/detail/FormCampaign';
// import { LOGIC_PATTERN_DEFAULT_DATA, BET_PATTERN_DEFAULT_DATA } from '../../constants/customCampaign';
// import CardNoTable, { TABS } from './CardNoTable';

// const Mode = {
//   AddNew: 1,
//   Edit: 2,
// };

// const DescriptionInput = styled.textarea`
//   margin-left: 1em;
//   width: 100%;
//   min-height: 5em;
//   max-height: 5em;
// `;

// const validateRequired = (value) => {
//   if (value === '') {
//     return i18n.t('fieldRequired');
//   }
//   return '';
// };

// class DetailSetting extends Component {
//   constructor(props) {
//     super(props);
//     const { selectTedId, type } = this.props;
//     let mode = '';
//     let dataInfoPopup = null;
//     if (selectTedId) {
//       mode = Mode.Edit;
//     } else {
//       mode = Mode.AddNew;
//       if (type === TABS.LIST_LOGIC_BET.id) {
//         dataInfoPopup = {
//           logic_pattern_name: '',
//           description: '',
//           card_nos: JSON.parse(JSON.stringify(LOGIC_PATTERN_DEFAULT_DATA)),
//         };
//       } else {
//         dataInfoPopup = {
//           bet_pattern_name: '',
//           description: '',
//           card_nos: JSON.parse(JSON.stringify(BET_PATTERN_DEFAULT_DATA)),
//         };
//       }
//     }

//     this.state = {
//       isEdited: false,
//       isLoading: false,
//       mode,
//       helpData: {
//         fieldName: '',
//         fieldContent: '',
//         optionName: '',
//         optionDetail: '',
//       },
//       errorMessageName: '',
//       dataInfoPopup,
//       isValidData: false,
//       haveChange: false,
//       haveChangeCardNo: false,
//     };

//     this.onSuccess = this.onSuccess.bind(this);
//     this.onError = this.onError.bind(this);

//     this.deleteLastColumnData = this.deleteLastColumnData.bind(this);
//     this.addNewColumnData = this.addNewColumnData.bind(this);
//     this.onChangeValueColumn = this.onChangeValueColumn.bind(this);
//     this.onOkClick = this.onOkClick.bind(this);
//     this.onResize = this.onResize.bind(this);
//     this.onRevert = this.onRevert.bind(this);
//     this.cardNoTableRef = createRef();
//     this.onBlurNameInput = this.onBlurNameInput.bind(this);
//     window.addEventListener('resize', this.onResize);
//   }

//   componentWillMount() {
//     const { selectTedId, type, getDataPopUp } = this.props;
//     let dataInfoPopup = null;
//     if (selectTedId) {
//       getDataPopUp(selectTedId, (data) => {
//         ApiErrorUtils.handleServerError(
//           data,
//           Alert.instance,
//           () => {
//             this.setState({
//               dataInfoPopup: JSON.parse(JSON.stringify(data.data)),
//               cloneDataInfoPopup: JSON.parse(JSON.stringify(data.data)),
//             });
//           },
//         );
//       }, () => { });
//     } else if (type === TABS.LIST_LOGIC_BET.id) {
//       dataInfoPopup = {
//         logic_pattern_name: '',
//         description: '',
//         card_nos: JSON.parse(JSON.stringify(LOGIC_PATTERN_DEFAULT_DATA)),
//       };
//     } else {
//       dataInfoPopup = {
//         bet_pattern_name: '',
//         description: '',
//         card_nos: JSON.parse(JSON.stringify(BET_PATTERN_DEFAULT_DATA)),
//       };
//     }
//     this.setState({
//       dataInfoPopup,
//     });
//   }

//   componentDidMount() {
//   }

//   componentWillUnmount() {
//     window.removeEventListener('resize', this.onResize);
//   }

//   onError(error) {
//     try {
//       ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
//     } catch (err) {
//       // do something
//     } finally {
//       this.setState({
//         isLoading: false,
//       });
//     }
//   }

//   onResize() {
//     this.setState({});
//   }

//   onRevert() {
//     const { cloneDataInfoPopup } = this.state;
//     this.setState({
//       dataInfoPopup: JSON.parse(JSON.stringify(cloneDataInfoPopup)),
//       errorMessageName: '',
//       haveChange: false,
//     }, () => {
//       this.validateData();
//     });
//   }

//   onOkClick() {
//     const { createOrUpdateData, onClose } = this.props;
//     const {
//       dataInfoPopup, haveChange, mode, haveChangeCardNo, isLoading,
//     } = this.state;
//     if (haveChange || mode === Mode.AddNew) {
//       this.validateData();
//       if (this.validateData()) {
//         if (haveChangeCardNo) {
//           Alert.instance.showAlertTwoButtons(
//             i18n.t('warning'),
//             i18n.t('warningChangeDataResetBot'),
//             [i18n.t('cancel'), i18n.t('ok')],
//             [
//               () => Alert.instance.hideAlert(), !isLoading ? () => {
//                 Alert.instance.hideAlert();
//                 this.setState({ isLoading: true });
//                 createOrUpdateData(dataInfoPopup, this.onSuccess, this.onError);
//               } : null,
//             ],
//           );
//         } else {
//           this.setState({ isLoading: true });
//           createOrUpdateData(dataInfoPopup, this.onSuccess, this.onError);
//         }
//       }
//     } else onClose();
//   }

//   onSuccess(data) {
//     const { onClose, callbackFetchData, currentPage } = this.props;
//     this.setState({ isLoading: false });
//     ApiErrorUtils.handleServerError(
//       data,
//       Alert.instance,
//       () => {
//         onClose();
//         callbackFetchData(currentPage);
//       },
//     );
//   }

//   onChangeInput(event, field) {
//     const { type } = this.props;
//     const state = { ...this.state };
//     state.haveChange = true;
//     const valueInput = event.target.value;
//     const { dataInfoPopup } = state;
//     if (field === 'name') {
//       dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'] = valueInput;
//       state.errorMessageName = validateRequired(valueInput);
//     } else {
//       dataInfoPopup.description = valueInput;
//     }
//     if (state.mode === Mode.Edit) {
//       state.isEdited = true;
//     }
//     this.setState(state);
//   }

//   onChangeValueColumn(value, index, field) {
//     const state = { ...this.state };
//     state.haveChange = true;
//     const { totalBotOffInData } = this.props;
//     if (totalBotOffInData) {
//       state.haveChangeCardNo = true;
//     }
//     const { dataInfoPopup } = state;
//     const { card_nos } = dataInfoPopup;
//     if (field === 'bet_value') {
//       card_nos[index][field] = value;
//       if (value === 'LOOK') {
//         card_nos[index].lose_next = card_nos[index].win_next;
//       }
//     } else {
//       if (card_nos[index].bet_value === 'LOOK') {
//         card_nos[index].win_next = value && !isNaN(value) ? Number(value) : '';
//         card_nos[index].lose_next = value && !isNaN(value) ? Number(value) : '';
//       }
//       card_nos[index][field] = value && !isNaN(value) ? Number(value) : '';
//     }
//     if (state.mode === Mode.Edit) {
//       state.isEdited = true;
//     }
//     this.setState(state);
//   }

//   onBlurNameInput() {
//     const { type } = this.props;
//     const state = { ...this.state };
//     const { dataInfoPopup } = state;
//     const name = dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'];
//     dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'] = name.trim();
//     this.setState(state);
//   }

//   validateData() {
//     const isValidCardNoData = this.cardNoTableRef.current.checkValidate();
//     const { dataInfoPopup } = this.state;
//     const { type } = this.props;
//     const errorMessageName = validateRequired(dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name']);
//     this.setState({
//       errorMessageName,
//     });
//     if (errorMessageName || !isValidCardNoData) return false;
//     return true;
//   }

//   deleteLastColumnData() {
//     const state = { ...this.state };
//     state.haveChange = true;
//     const { totalBotOffInData } = this.props;
//     if (totalBotOffInData) {
//       state.haveChangeCardNo = true;
//     }
//     const { dataInfoPopup } = state;
//     const { card_nos } = dataInfoPopup;
//     card_nos.map((item) => {
//       if (item.win_next === card_nos.length) {
//         item.win_next = '';
//       }
//       if (item.lose_next === card_nos.length) {
//         item.lose_next = '';
//       }
//     });
//     card_nos.pop();
//     if (state.mode === Mode.Edit) {
//       state.isEdited = true;
//     }
//     this.setState(state);
//   }

//   addNewColumnData() {
//     const state = { ...this.state };
//     state.haveChange = true;
//     const { totalBotOffInData } = this.props;
//     if (totalBotOffInData) {
//       state.haveChangeCardNo = true;
//     }
//     const { type, settingWorkerData } = this.props;
//     const { dataInfoPopup } = state;
//     if (dataInfoPopup.card_nos.length >= settingWorkerData.max_card_no) return;
//     const betField = type === TABS.LIST_LOGIC_BET.id ? 'bet_point' : 'bet_value';
//     const { card_nos } = dataInfoPopup;
//     const newRowCardNo = {
//       card_no: card_nos.length + 1,
//       [betField]: type === TABS.LIST_LOGIC_BET.id ? '' : 'B',
//       win_next: '',
//       lose_next: '',
//     };
//     card_nos.push(newRowCardNo);
//     if (state.mode === Mode.Edit) {
//       state.isEdited = true;
//     }
//     this.setState(state);
//   }

//   creatButtonHelp(fieldName, fieldContent, optionName, optionDetail, optionDescription = null) {
//     const { helpData } = this.state;
//     return renderButtonHelp(fieldName, helpData.fieldName, () => {
//       this.setState({
//         helpData: {
//           fieldName, fieldContent, optionName, optionDetail, optionDescription,
//         },
//       });
//     });
//   }

//   render() {
//     const {
//       isEdited, isLoading, helpData, errorMessageName,
//       dataInfoPopup,
//     } = this.state;
//     const {
//       fontSize, orient, type, settingWorkerData,
//     } = this.props;
//     return (
//       <WrapperDetail fontSize={fontSize}>
//         <Wrapper>
//           <Column width={29}>
//             <Blank height={2} />
//             <Row style={{ justifyContent: 'space-between' }}>
//               <TitleGroup width={8}>
//                 {i18n.t(`${type === TABS.LIST_LOGIC_BET.id ? 'customCampaign.logicPatternName' : 'customCampaign.betPatternName'}`).concat(':')}
//               </TitleGroup>
//               {this.creatButtonHelp('name', 'help.name', '', '')}
//             </Row>
//             <Row id="RowName">
//               <Blank width={1} />
//               <FormCampaign
//                 onChange={e => this.onChangeInput(e, 'name')}
//                 onBlur={this.onBlurNameInput}
//                 isValid={errorMessageName === ''}
//                 invalidText={errorMessageName}
//                 margin={errorMessageName === '' ? '' : '1em 0 0 0'}
//                 name="name"
//                 maxLength={-1}
//                 labelPaddingBottom={4}
//                 width={28}
//                 value={dataInfoPopup && dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name']}
//               />
//             </Row>
//             <Blank height={1} />
//             <Row style={{ justifyContent: 'space-between' }}>
//               <TitleGroup width={8}>
//                 {i18n.t('customCampaign.description').concat(':')}
//               </TitleGroup>
//               {
//                 this.creatButtonHelp(
//                   'customCampaign.description',
//                   `help.description${type === TABS.LIST_LOGIC_BET.id ? 'LogicPattern' : 'BetPattern'}`,
//                   '',
//                   '',
//                 )
//               }
//             </Row>
//             <Row>
//               <DescriptionInput
//                 onChange={e => this.onChangeInput(e, 'description')}
//                 value={dataInfoPopup && dataInfoPopup.description}
//               />
//             </Row>
//             <Blank height={1} />
//             <Row style={{ justifyContent: 'space-between' }}>
//               <TitleGroup width={8}>
//                 {i18n.t('customCampaign.cardNoSetting').concat(':')}
//               </TitleGroup>
//               {this.creatButtonHelp('customCampaign.cardNoSetting', 'help.cardNo', '', '')}
//             </Row>
//             <Row>
//               <CardNoTable
//                 cardNoData={dataInfoPopup ? dataInfoPopup.card_nos : []}
//                 deleteLastColumnData={this.deleteLastColumnData}
//                 addNewColumnData={this.addNewColumnData}
//                 onChangeValueColumn={this.onChangeValueColumn}
//                 type={type}
//                 ref={this.cardNoTableRef}
//                 isMobile={orient}
//                 settingWorkerData={settingWorkerData}
//               />
//             </Row>
//           </Column>
//           <HelpCampaign
//             fieldName={helpData.fieldName}
//             fieldContent={helpData.fieldContent}
//             optionName={helpData.optionName}
//             optionDetail={helpData.optionDetail}
//             optionDetailContent={helpData.optionDetailContent}
//           />
//         </Wrapper>
//         <FooterWrapper>
//           {
//             isEdited && <ButtonRevert onClick={this.onRevert}>{i18n.t('revert')}</ButtonRevert>
//           }
//           <ButtonOK onClick={!isLoading ? this.onOkClick : null}>
//             {isEdited ? i18n.t('save') : i18n.t('ok')}
//           </ButtonOK>
//         </FooterWrapper>
//         <Spinner isLoading={isLoading} />
//       </WrapperDetail>
//     );
//   }
// }

// DetailSetting.defaultProps = {
//   onClose: null,
//   selectTedId: null,
// };

// DetailSetting.propTypes = {
//   onClose: PropTypes.func,
//   fontSize: PropTypes.number.isRequired,
//   selectTedId: PropTypes.number,
//   createOrUpdateData: PropTypes.func.isRequired,
//   type: PropTypes.number.isRequired,
//   callbackFetchData: PropTypes.func.isRequired,
//   settingWorkerData: PropTypes.object.isRequired,
//   getDataPopUp: PropTypes.func.isRequired,
//   currentPage: PropTypes.number.isRequired,
//   totalBotOffInData: PropTypes.number.isRequired,
// };

// export default DetailSetting;
