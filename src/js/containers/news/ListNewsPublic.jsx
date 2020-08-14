import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
// import ApiErrorCode from '../../constants/apiErrorCode';
import Alert from '../../components/common/Alert/Alert';
import * as newsActions from '../../actions/news';
import {
  Wrapper, Title, Blank,
  WrapperContent, ListNews,
} from './listNewsPublicStyle';
import { ModalWrapper, ModalHeaderCustom } from '../../components/common/CommonStyle';
import i18n from '../../i18n/i18n';
import ButtonNews from '../../components/news/ButtonNews';
import ListNewsPublicItem from '../../components/news/ListNewsPublicItem';
import NewDetail from '../../components/news/NewDetail';
import NewsHelper from '../../helpers/NewsHelper';
import StorageUtils from '../../helpers/StorageUtils';
import { LANGUAGE } from '../../constants/language';
import ChangeLanguage from '../changeLanguage/ChangeLanguage';
import { ENABLE_CHANGE_LANGUAGE } from '../../config';

const SelectLangWrapper = styled.div`
  z-index: 1;
  margin-right: 5px;
`;

const Img = styled.img`
  width: 3em;
  border-radius: 0.3em;
`;

const WrapperIcon = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 1em;
  right: 1em;
`;

class ListNewsPublic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPopUpChangeLang: false,
      isShowAll: false,
      isShowDetail: false,
      currentPage: 1,
      perPage: 100,
      newDetail: {},
      isLockShowAll: false,
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onClickNotifyButton = this.onClickNotifyButton.bind(this);
    this.showModalDetail = this.showModalDetail.bind(this);
    this.closeModalDetail = this.closeModalDetail.bind(this);
    this.closeNotifyButton = this.closeNotifyButton.bind(this);
    NewsHelper.getInstance().init();
  }

  componentDidMount() {
    this.fetchListNewsNotLogin();
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({});
    });
  }

  onError(data) {
    ApiErrorUtils.handleHttpError(data, Alert.instance, () => {
    });
    this.setState({});
  }

  onClickNotifyButton() {
    const { isShowAll } = this.state;
    this.setState({ isShowAll: !isShowAll });
  }

  closeNotifyButton() {
    const { isLockShowAll, isShowDetail } = this.state;
    if (!isLockShowAll && !isShowDetail) {
      this.setState({
        isShowAll: false,
      });
    } else {
      this.setState({
        isLockShowAll: false,
      });
    }
  }

  showModalDetail(newDetail) {
    const { actions } = this.props;
    this.setState({
      isShowDetail: true,
      isLockShowAll: true,
      newDetail,
    });
    actions.updateHasReadNewTop(newDetail.id, newDetail.start_plan);
  }

  closeModalDetail() {
    this.setState({
      isShowDetail: false,
      isLockShowAll: true,
    });
  }

  fetchNewDetailNotLogin() {
    const { actions } = this.props;
    const { newDetail } = this.state;
    const params = {
      id: newDetail.id,
    };
    actions.fetchNewDetailNotLogin(params, this.onSuccess, this.onError);
  }

  fetchListNewsNotLogin() {
    const { actions } = this.props;
    const { currentPage, perPage } = this.state;
    const params = {
      currentPage,
      perPage,
    };
    actions.fetchListNewsNotLogin(params, this.onSuccess, this.onError);
  }

  renderListMessage(littNewConvert) {
    return littNewConvert.map(item => (
      <ListNewsPublicItem
        key={item.id}
        newItem={item}
        showModalDetail={this.showModalDetail}
        isNewPublic
      />
    ));
  }

  renderDetailModal() {
    const { fontSize, isMobile } = this.props;
    const { newDetail, isShowDetail } = this.state;
    return (
      <ModalWrapper
        isOpen={isShowDetail}
        toggle={this.closeModalDetail}
        isMobile={isMobile}
        centered
      >
        <ModalHeaderCustom bgrColor="#333333" toggle={this.closeModalDetail} />
        <ModalBody>
          <NewDetail
            newDetail={newDetail}
            fontSize={fontSize}
          />
        </ModalBody>
      </ModalWrapper>
    );
  }

  render() {
    const { data } = this.props;
    const { isShowAll, isShowPopUpChangeLang } = this.state;
    const { listNews } = data;
    let totalNew = listNews.filter(item => item.is_new === true).length;
    if (totalNew > 9) totalNew = '9+';
    const width = isShowAll ? 22 : 4;
    const height = isShowAll ? 33 : 4;

    const currentLang = StorageUtils.getItem('i18nextLng');
    const index = LANGUAGE.findIndex(item => item.value === currentLang.substr(0, 2));
    let flag = LANGUAGE[1].icon;
    if (index !== -1) {
      flag = LANGUAGE.find(item => item.value === currentLang.substr(0, 2)).icon;
    }
    return (
      <Wrapper
        id="New"
        width={width}
        height={height}
        isShowAll={isShowAll}
        onBlur={this.closeNotifyButton}
        tabIndex="-1"
      >
        {isShowAll ? (
          <WrapperContent>
            <Blank height={1} />
            <Title>{i18n.t('news.title')}</Title>
            <Blank height={2} />
            <ListNews>
              {listNews.length === 0 && i18n.t('notHaveNew')}
              {this.renderListMessage(listNews)}
            </ListNews>
          </WrapperContent>
        ) : ''}
        {this.renderDetailModal()}
        <WrapperIcon>
          {
            ENABLE_CHANGE_LANGUAGE && (
              <SelectLangWrapper onClick={() => this.setState({ isShowPopUpChangeLang: true })}>
                <Img src={flag} />
              </SelectLangWrapper>
            )
          }
          <ButtonNews countNew={totalNew} onClick={this.onClickNotifyButton} />
        </WrapperIcon>
        <ChangeLanguage isShow={isShowPopUpChangeLang} onClose={() => this.setState({ isShowPopUpChangeLang: false })} />
      </Wrapper>
    );
  }
}

ListNewsPublic.propTypes = {
  actions: PropTypes.object.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    data: {
      listNews: state.news.listNews,
      newDetail: state.news.newDetail,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchListNewsNotLogin: bindActionCreators(newsActions.fetchListNewsNotLogin, dispatch),
      fetchNewDetailNotLogin: bindActionCreators(newsActions.fetchNewDetailNotLogin, dispatch),
      updateHasReadNewTop: bindActionCreators(newsActions.updateHasReadNewTop, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListNewsPublic);
