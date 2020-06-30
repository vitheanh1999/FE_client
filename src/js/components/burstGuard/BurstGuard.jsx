import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import Block from '../common/Block';
import i18n from '../../i18n/i18n';
import Spinner from '../common/Spinner';
import { getLinkBuyBurst } from '../../config';

const BurstInfo = styled.div`
  font-weight: 600;
  font-size: 1.1em;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const UserGuide = styled.div`
  white-space: pre-wrap;
  font-size: 1.1em;
  padding: 1em;
`;

const ButtonCustom = styled(Button)`
  margin-top: 1em;
  background-color: ${props => (props.isDisable ? '#ccc' : '#2d889c')};
  font-size: 18px;
  color: #fff;

  &:hover {
    background-color: ${props => (props.isDisable ? '#ccc' : '#2d889cf5')};
    color: #fff;
  }
`;

class BurstGuard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.handleBuyBurst = this.handleBuyBurst.bind(this);
  }

  componentDidMount() {
  }

  handleBuyBurst() {
    window.open(getLinkBuyBurst());
    this.setState({});
  }

  renderContent() {
    const { userInfo } = this.props;
    const isDisable = false;
    return (
      <div>
        <UserGuide>
          {i18n.t('burstGuardUserGuide')}
        </UserGuide>
        <BurstInfo>
          <div>
            {i18n.t('burstNumber')}: {userInfo && userInfo.detail && userInfo.detail.burst_count}
            {/* {i18n.t('burstNumber')}: - */}
          </div>
          <ButtonCustom
            isDisable={isDisable}
            onClick={isDisable ? () => {} : this.handleBuyBurst}
          >{i18n.t('buyBurst')}
          </ButtonCustom>
        </BurstInfo>
      </div>
    );
  }

  render() {
    return (
      <div style={{ margin: '1.111em 2em' }}>
        <Spinner isLoading={this.state.isLoading} />
        <Block
          title={i18n.t('burstTicket')}
          content={this.renderContent()}
        />
      </div>
    );
  }
}

BurstGuard.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

BurstGuard.defaultProps = {
};

export default BurstGuard;
