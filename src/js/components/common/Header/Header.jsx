import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import ApiErrorUtils from '../../../helpers/ApiErrorUtils';
import Alert from '../Alert/Alert';
import { ENABLE_LOGIN } from '../../../config';
import StorageUtils, { STORAGE_KEYS } from '../../../helpers/StorageUtils';
import i18n from '../../../i18n/i18n';
import { getCompanyInfo } from '../../login/SignIn';
import { changeMinDate } from '../../../constants/Constants';
import { ORIENTATION } from '../../../helpers/system';
import images from '../../../../assets/images';

const UserId = styled.div`
  height: 1.25em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 800;
`;

const TabName = styled.span`
  font-weight: bold;
  font-size: 1.3em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContent = styled.div`
  height: 4em;
  background-color: #252525;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 2.22em;
  padding-right: 2.22em;
`;

const HeaderWrapper = styled.div`
  width: 100%;
`;

const Account = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabIcon = styled.img`
  width: 2.5em;
  margin-right: 0.5em;
`;

const MenuIcon = styled.img`
  width: 2.5em;

  &: active {
    opacity: 0.5;
  }
`;

class Header extends Component {
  constructor() {
    super();
    this.state = {
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    // const { fetchUser } = this.props;
    // fetchUser(this.onSuccess, this.onError);
  }

  onSuccess(data) {
    StorageUtils.setCompanyInfo(getCompanyInfo(data.data.provider_code));
    if (data && data.data && data.data.provider_code === 'ray9') {
      changeMinDate('2019-11-10');
    }
    this.setState({});
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        if (!data.data.luc_user_id) {
          // this.props.handleChangeTab(TAB.CONNECT_TO_LUC);
        }
      },
      () => { },
    );
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(
      error,
      Alert.instance,
    );
    this.setState({});
  }

  handleLogout() {
    this.props.logout();
  }

  render() {
    const {
      tabInfo, orient, openMenu,
    } = this.props;
    let title = '';
    let canLogout = true;
    title = tabInfo.name;
    canLogout = ENABLE_LOGIN;
    const checkLandscape = (orient === ORIENTATION.Landscape);

    return (
      <HeaderWrapper>
        <HeaderContent>
          <TabName>
            {!checkLandscape && <TabIcon src={tabInfo.icon} alt="" />}
            {title}
          </TabName>
          {
            checkLandscape
              ? (
                <Account>
                  <UserId>
                    {StorageUtils.getSectionStorageItem(STORAGE_KEYS.userName)}
                  </UserId>
                  {
                    canLogout && (
                      <Button
                        onClick={this.handleLogout}
                        style={{ marginLeft: '1em' }}
                        variant="outline-info"
                      >
                        {i18n.t('logout')}
                      </Button>
                    )
                  }
                </Account>
              )
              : <MenuIcon src={images.iconMenu} alt="" onClick={openMenu} />
          }
        </HeaderContent>
      </HeaderWrapper>
    );
  }
}

Header.propTypes = {
  tabInfo: PropTypes.objectOf(PropTypes.any),
  logout: PropTypes.func.isRequired,
  orient: PropTypes.string,
  openMenu: PropTypes.func.isRequired,
};

Header.defaultProps = {
  tabInfo: {},
  orient: ORIENTATION.Landscape,
};

export default Header;
