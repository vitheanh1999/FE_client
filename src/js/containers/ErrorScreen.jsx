import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import BaseContainer from './mainContainerMobile/BaseContainer';
import images from '../theme/images';
import * as maintainActions from '../actions/maintain';
import Alert from '../components/common/Alert/Alert';
import i18n from '../i18n/i18n';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-image: url("${props => props.src}");
  background-size: cover;
`;

const Content = styled.div`
  position: relative;
  margin-bottom: 5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextError = styled.div`
  font-size: 3em;
  font-weight: 600;
  margin: 0.5em 0;
`;

const TextError2 = styled.div`
  font-size: 1.4em;
  font-weight: 600;
`;

const getBackgroundUrl = () => images.errorDBACScreen;

class ErrorScreen extends BaseContainer {
  componentDidMount() {
    super.componentDidMount();
    this.props.fetchMaintainInfo(this.onCheckMaintainSuccess, this.onCheckMaintainError);
  }

  render() {
    return (
      <Wrapper src={getBackgroundUrl()}>
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <Content>
          <TextError2>{i18n.t('textError1')}</TextError2>
          <TextError>{i18n.t('titleError')}</TextError>
          <TextError2>{i18n.t('textError2')}</TextError2>
        </Content>
        <Alert />
      </Wrapper>
    );
  }
}


ErrorScreen.propTypes = {
  history: PropTypes.object.isRequired,
  maintainInfo: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = state => ({
  maintainInfo: state.Maintain.maintainInfo,
});

const mapDispatchToProps = dispatch => ({
  setMaintainInfo: bindActionCreators(maintainActions.setMaintainInfo, dispatch),
  fetchMaintainInfo: bindActionCreators(maintainActions.fetchMaintainInfo, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ErrorScreen);
