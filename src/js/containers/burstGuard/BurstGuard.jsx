import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BurstGuardComponent from '../../components/burstGuard/BurstGuard';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

class BurstGuard extends Component {
  componentDidMount() {
    const { fetchListBot } = this.props;
    fetchListBot();
  }

  render() {
    return (
      <Wrapper>
        <Content>
          <BurstGuardComponent
            userInfo={this.props.data.user}
          />
        </Content>
      </Wrapper>
    );
  }
}

BurstGuard.propTypes = {
  fetchListBot: PropTypes.func,
  data: PropTypes.object.isRequired,
};

BurstGuard.defaultProps = {
  fetchListBot: () => {},
};

const mapStateToProps = state => ({
  data: {
    user: state.User,
  },
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BurstGuard);
