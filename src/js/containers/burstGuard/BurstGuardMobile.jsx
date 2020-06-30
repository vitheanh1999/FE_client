import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import i18n from '../../i18n/i18n';
import { getLinkBuyBurst } from '../../config';
import { ViewModeBtn } from '../../components/listBots/listBotsMobileStyle';

const Wrapper = styled.div`
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.scale}em;
  margin-top: ${props => props.scale}em;
  font-size: 1em;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: ${props => props.scale}em;
`;

const BuyBurstBtn = styled(ViewModeBtn)`
  color: white;
  background: #2d889c;
  cursor: pointer;
`;

class BurstGuardMobile extends Component {
  constructor(props) {
    super(props);

    this.handleBuyBurst = this.handleBuyBurst.bind(this);
  }

  handleBuyBurst() {
    window.open(getLinkBuyBurst());
    this.setState({});
  }

  render() {
    const scale = window.innerWidth / 320;

    return (
      <Wrapper scale={scale}>
        <Title scale={scale}>
          {i18n.t('burstGuardGuideMobile')}
        </Title>
        <Title scale={scale}>
          {i18n.t('burstNumber')}: -
        </Title>
        <BuyBurstBtn scale={scale} onClick={this.handleBuyBurst}>
          {i18n.t('buyBurst')}
        </BuyBurstBtn>
      </Wrapper>
    );
  }
}

BurstGuardMobile.propTypes = {
};

BurstGuardMobile.defaultProps = {
};

const mapStateToProps = state => ({
  data: {
    user: state.User,
  },
});

const mapDispatchToProps = () => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurstGuardMobile);
