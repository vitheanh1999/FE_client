import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import ChargeComponent from '../../components/charge/Charge';
import * as DepositActions from '../../actions/Deposit';
import * as botsActions from '../../actions/ListBots';

class Charge extends Component {
  componentDidMount() { }

  render() {
    const {
      data, actions, fontSize, isMobile,
    } = this.props;
    const { bots, lucUserGC } = data.listBots;
    const arrayBots = [];
    if (bots) {
      Object.keys(bots).map((key) => {
        arrayBots.push(bots[key]);
        return true;
      });
    }
    return (
      <ChargeComponent
        fetchListBots={actions.fetchListBots}
        fontSize={fontSize}
        listBots={arrayBots}
        fetchPayoutHistory={actions.fetchPayoutHistory}
        getGiftHistory={actions.getGiftHistory}
        total={data.listBots.total}
        lucUserGC={lucUserGC}
        isMobile={isMobile}
        gift={actions.gift}
      />
    );
  }
}

Charge.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  data: {
    deposit: state.Deposit,
    listBots: state.ListBots,
  },
  state,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchPayoutHistory: bindActionCreators(DepositActions.fetchPayoutHistory, dispatch),
    fetchListBots: bindActionCreators(botsActions.fetchListBots, dispatch),
    getGiftHistory: bindActionCreators(DepositActions.getGiftHistory, dispatch),
    gift: bindActionCreators(DepositActions.gift, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Charge);
