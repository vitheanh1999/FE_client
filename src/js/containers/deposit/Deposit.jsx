// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import PropTypes from 'prop-types';
// import * as DepositActions from '../../actions/Deposit';
// import * as botsActions from '../../actions/ListBots';
// import * as authActions from '../../actions/auth';
// import DepositComponent from '../../components/deposit/Deposit';
// import DepositMobile from '../../components/deposit/DepositMobile';

// const isMobile = false;
// class Deposit extends Component {
//   componentDidMount() { }

//   render() {
//     const { data, actions } = this.props;
//     return (
//       <React.Fragment>
//         {
//           isMobile ? (
//             <DepositMobile
//               depositData={data.deposit}
//               fetchUser={actions.fetchUser}
//               listBots={data.listBots.bots}
//               fetchPaymentInfo={actions.fetchPaymentInfo}
//               requestPaying={actions.requestPaying}
//               getPriceUSD={actions.getPriceUSD}
//               getPriceBTC={actions.getPriceBTC}
//               fetchListBots={actions.fetchListBots}
//               rechargeBOTGC={actions.rechargeBOTGC}
//               selectAllBotsEnableDeposit={actions.selectAllBotsEnableDeposit}
//               getDepositHistory={actions.getDepositHistory}
//               getGiftHistory={actions.getGiftHistory}
//               gift={actions.gift}
//             />
//           ) : (
//             <DepositComponent
//               depositData={data.deposit}
//               fetchUser={actions.fetchUser}
//               listBots={data.listBots.bots}
//               fetchPaymentInfo={actions.fetchPaymentInfo}
//               requestPaying={actions.requestPaying}
//               getPriceUSD={actions.getPriceUSD}
//               getPriceBTC={actions.getPriceBTC}
//               fetchListBots={actions.fetchListBots}
//               rechargeBOTGC={actions.rechargeBOTGC}
//               selectAllBotsEnableDeposit={actions.selectAllBotsEnableDeposit}
//               getDepositHistory={actions.getDepositHistory}
//               getGiftHistory={actions.getGiftHistory}
//               getMinMaxProfitHistory={actions.getMinMaxProfitHistory}
//               gift={actions.gift}
//             />
//           )
//         }
//       </React.Fragment>
//     );
//   }
// }

// Deposit.propTypes = {
//   actions: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired,
// };

// const mapStateToProps = state => ({
//   data: {
//     deposit: state.Deposit,
//     listBots: state.ListBots,
//   },
// });

// const mapDispatchToProps = dispatch => ({
//   actions: {
//     fetchUser: bindActionCreators(authActions.fetchUser, dispatch),
//     fetchListBots: bindActionCreators(botsActions.fetchListBots, dispatch),
//     selectAllBotsEnableDeposit: bindActionCreators(
//       DepositActions.selectAllBotsEnableDeposit, dispatch,
//     ),
//     fetchPaymentInfo: bindActionCreators(DepositActions.fetchPaymentInfo, dispatch),
//     getPriceUSD: bindActionCreators(DepositActions.getPriceUSD, dispatch),
//     getPriceBTC: bindActionCreators(DepositActions.getPriceBTC, dispatch),
//     requestPaying: bindActionCreators(DepositActions.requestPaying, dispatch),
//     getDepositHistory: bindActionCreators(DepositActions.getDepositHistory, dispatch),
//     getGiftHistory: bindActionCreators(DepositActions.getGiftHistory, dispatch),
//     getMinMaxProfitHistory: bindActionCreators(DepositActions.getMinMaxProfitHistory, dispatch),
//     gift: bindActionCreators(DepositActions.gift, dispatch),
//   },
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
