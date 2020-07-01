import React, { Component } from 'react';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { bindActionCreators } from 'redux';
import { ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert/Alert';
import i18n from '../../i18n/i18n';
import * as newsActions from '../../actions/news';
import {
  ModalWrapper, ContentContainer,
  ContentBody, WrapperPaginationCustom,
  ModalHeaderCustom,
} from '../../components/common/CommonStyle';
import ListNewsPublicItem from '../../components/news/ListNewsPublicItem';
import NewDetail from '../../components/news/NewDetail';
import NewsHelper from '../../helpers/NewsHelper';

class ListNewsAll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowAll: false,
      isShowDetail: false,
      isLoading: false,
      currentPage: 1,
      perPage: 10,
      newDetail: {},
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onClickNotifyButton = this.onClickNotifyButton.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.showModalDetail = this.showModalDetail.bind(this);
    this.closeModalDetail = this.closeModalDetail.bind(this);
    NewsHelper.getInstance().init();
  }

  componentDidMount() {
    this.fetchListNews();
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({ isLoading: false });
    });
  }

  onError(data) {
    ApiErrorUtils.handleHttpError(data, Alert.instance, () => {
    });
    this.setState({ isLoading: false });
  }

  onClickNotifyButton() {
    const { isShowAll } = this.state;
    this.setState({ isShowAll: !isShowAll });
  }

  onChangePage(page) {
    this.setState({
      currentPage: page,
    }, () => this.fetchListNews());
  }

  showModalDetail(newDetail) {
    this.setState({
      isShowDetail: true,
      newDetail,
    }, () => this.fetchNewDetail());
    const { actions } = this.props;
    actions.updateHasReadNew(newDetail.id, newDetail.start_plan);
  }

  closeModalDetail() {
    this.setState({
      isShowDetail: false,
    });
  }

  fetchNewDetail() {
    const { actions } = this.props;
    const { newDetail } = this.state;
    const params = {
      id: newDetail.id,
    };
    this.setState({ isLoading: true });
    actions.fetchNewDetail(params, this.onSuccess, this.onError);
  }

  fetchListNews() {
    const { actions } = this.props;
    const { currentPage, perPage } = this.state;
    const params = {
      currentPage,
      perPage,
    };
    this.setState({ isLoading: true });
    actions.fetchListNews(params, this.onSuccess, this.onError);
  }

  renderListMessage(littNewConvert) {
    return littNewConvert.map(item => (
      <ListNewsPublicItem
        key={item.id}
        newItem={item}
        showModalDetail={this.showModalDetail}
      />
    ));
  }

  renderDetailModal() {
    const { data, isMobile, fontSize } = this.props;
    const { isShowDetail } = this.state;
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
            newDetail={data.newDetail}
            fontSize={fontSize}
          />
        </ModalBody>
      </ModalWrapper>
    );
  }

  render() {
    const { data } = this.props;
    const { perPage, currentPage } = this.state;
    const { total, listNews } = data;
    return (
      <ContentContainer>
        <ContentBody>
          {total === 0 && i18n.t('notHaveNew')}
          {this.renderListMessage(listNews)}
          {
            (total / perPage > 1) ? (
              <WrapperPaginationCustom>
                <Pagination
                  type="autoBot"
                  current={currentPage}
                  total={total}
                  onChange={this.onChangePage}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1em',
                  }}
                />
              </WrapperPaginationCustom>
            ) : ''
          }
        </ContentBody>
        {this.renderDetailModal()}
        <Spinner isLoading={this.state.isLoading} />
      </ContentContainer>
    );
  }
}

ListNewsAll.propTypes = {
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
      total: state.news.total,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchListNews: bindActionCreators(newsActions.fetchListNews, dispatch),
      fetchNewDetail: bindActionCreators(newsActions.fetchNewDetail, dispatch),
      updateHasReadNew: bindActionCreators(newsActions.updateHasReadNew, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListNewsAll);
