// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import i18n from '../../i18n/i18n';
// import { IconAdd } from '../campaign/campaignStyle';
// import { images } from '../../theme';
// import CustomCampaignInput from './CustomCampaignInput';
// import RefPool from '../../helpers/RefPool';
// import Dropdown from '../common/Dropdown/Dropdown';

export const TABS = {
  LIST_LOGIC_BET: { id: 1, text: i18n.t('customCampaign.listLogic') },
  LIST_BET_PATTERN: { id: 2, text: i18n.t('customCampaign.listBet') },
};

export const OPTIONS_BET = [
  {
    text: 'BANKER',
    value: 'B',
    id: 1,
  },
  {
    text: 'PLAYER',
    value: 'P',
    id: 2,
  },
  {
    text: 'LOOK',
    value: 'LOOK',
    id: 3,
  },
];

// const TH = styled.th`
//   color: #fff;
//   background-color: #2d889c;
//   text-align: center;

//   :first-child {
//     width: 16%;
//   }

//   :nth-child(2) {
//     width: 12em;
//   }
// `;

// const Table = styled.table`
//   margin-left: 1em;
//   max-width: ${props => (props.isMobile ? 'unset' : '30em')};
// `;

// const TD = styled.td`
//   padding: 0.1em;
// `;

// const DeleteLastColumnButton = styled.div`
//   cursor: pointer;
//   color: red;
//   font-size: ${props => (props.isMobile ? '1.6em' : '1.4em')};
// `;

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const WrapperAddNewColumn = styled.div`
//   margin-top: 1em;
//   padding: 0.5em;
//   background-color: #2d889c;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// `;

// class CardNoTable extends Component {
//   constructor(props) {
//     super(props);
//     const { type } = this.props;
//     this.state = {
//     };

//     this.onResize = this.onResize.bind(this);
//     window.addEventListener('resize', this.onResize);
//     this.refPool = new RefPool();
//     this.HEADER_TABLE = ['Card No', type === TABS.LIST_LOGIC_BET.id ? 'BET Point' : 'BET Value', 'Win Next', 'Lose Next'];
//   }

//   componentDidMount() {
//   }

//   componentWillUnmount() {
//     window.removeEventListener('resize', this.onResize);
//   }

//   onResize() {
//     this.setState({});
//   }

//   validate() {
//     const { cardNoData } = this.props;
//     for (let i = 0; i < cardNoData.length; i += 1) {
//       for (let j = 0; j < this.HEADER_TABLE.length; j += 1) {
//         this.refPool.getRef(`${i}-${j}`).current.validate();
//       }
//     }
//   }

//   checkValidate() {
//     this.validate();
//     const { cardNoData } = this.props;
//     for (let i = 0; i < cardNoData.length; i += 1) {
//       for (let j = 0; j < this.HEADER_TABLE.length; j += 1) {
//         if (!this.refPool.getRef(`${i}-${j}`).current.validate()) {
//           return false;
//         }
//       }
//     }
//     return true;
//   }

//   renderTableData(item, length, index) {
//     const {
//       onChangeValueColumn, deleteLastColumnData, settingWorkerData, isMobile,
//     } = this.props;
//     return (
//       <React.Fragment>
//         <tr>
//           {
//             Object.keys(item).map((field, i) => (
//               <TD>
//                 {
//                   field === 'bet_value' ? (
//                     <Dropdown
//                       data={OPTIONS_BET}
//                       onChangeSelected={(id, info) => {
//                         onChangeValueColumn(info.value, index, field);
//                       }}
//                       defaultSelectedId={OPTIONS_BET[OPTIONS_BET.findIndex(option => option.value === item.bet_value)].id}
//                       customStyle={{
//                         width: '12em',
//                         height: 'unset',
//                       }}
//                       ref={this.refPool.getOrCreatRef(`${index}-${i}`)}
//                     />
//                   ) : (
//                     <CustomCampaignInput
//                       value={item[field]}
//                       isDisabled={field === 'card_no'}
//                       onChange={(value) => {
//                         onChangeValueColumn(value, index, field);
//                       }}
//                       maxValue={field === 'bet_point' ? settingWorkerData.max_bet_point : length}
//                       minValue={field === 'bet_point' ? 0 : 1}
//                       ref={this.refPool.getOrCreatRef(`${index}-${i}`)}
//                     />
//                   )
//                 }
//               </TD>
//             ))
//           }
//           {index === length - 1 && index ? (
//             <TD>
//               <DeleteLastColumnButton
//                 isMobile={isMobile}
//                 onClick={() => deleteLastColumnData()}
//               >
//                 ✕
//               </DeleteLastColumnButton>
//             </TD>
//           ) : (
//             <TD>
//                 &nbsp;&nbsp;
//             </TD>
//           )
//           }
//         </tr>
//       </React.Fragment>
//     );
//   }

//   render() {
//     const {
//       cardNoData, addNewColumnData, isMobile, settingWorkerData,
//     } = this.props;
//     return (
//       <Wrapper>
//         <Table isMobile={isMobile}>
//           <thead>
//             <tr>
//               {
//                 this.HEADER_TABLE.map(item => (
//                   <TH>
//                     {item}
//                   </TH>
//                 ))
//               }
//             </tr>
//           </thead>
//           <tbody>
//             {
//               cardNoData.map((item, index) => (
//                 this.renderTableData(item, cardNoData.length, index)
//               ))
//             }
//           </tbody>
//         </Table>
//         {
//           cardNoData.length < settingWorkerData.max_card_no && (
//             <div style={{ alignSelf: 'center' }}>
//               <WrapperAddNewColumn
//                 onClick={() => addNewColumnData()}
//               >
//                 <IconAdd
//                   style={{ marginRight: 0 }}
//                   src={images.add}
//                 />
//               </WrapperAddNewColumn>
//             </div>
//           )
//         }
//       </Wrapper>
//     );
//   }
// }

// CardNoTable.defaultProps = {
// };

// CardNoTable.propTypes = {
//   cardNoData: PropTypes.any.isRequired,
//   addNewColumnData: PropTypes.func.isRequired,
//   deleteLastColumnData: PropTypes.func.isRequired,
//   onChangeValueColumn: PropTypes.func.isRequired,
//   type: PropTypes.number.isRequired,
//   isMobile: PropTypes.bool.isRequired,
//   settingWorkerData: PropTypes.any.isRequired,
// };

// export default CardNoTable;
