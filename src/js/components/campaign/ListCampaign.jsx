import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import i18n from '../../i18n/i18n';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Spinner from '../common/Spinner';
import {
  ContentContainer, ContentHeader, MedianStrip,
  ContentBody, WrapperPaginationCustom,
} from '../common/CommonStyle';
import { ButtonAddCampaign, IconAdd, Blank } from './campaignStyle';
import CampaignItemList from './CampaignItemList';
import images from '../../theme/images';
import { PER_PAGE } from '../../constants/Constants';

class ListCampaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentPage: 1,
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onSuccessDelete = this.onSuccessDelete.bind(this);
    this.onError = this.onError.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.handleCampaign = this.handleCampaign.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchListCampaigns();
    this.props.fetchListPattern();
  }

  onSuccess() {
    this.setState({ isLoading: false });
  }

  onSuccessDelete(data) {
    const { listCampaigns } = this.props;
    let { currentPage } = this.state;
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        Alert.instance.showAlert(i18n.t('success'), data.message);
        if (listCampaigns.length === 1 && currentPage !== 1) {
          currentPage -= 1;
        }
        this.setState({ currentPage }, () => this.fetchListCampaigns());
      },
      () => { },
    );
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onChangePage(page) {
    this.setState(
      { currentPage: page, isLoading: true },
      () => this.fetchListCampaigns(),
    );
  }

  handleDelete(id) {
    const { deleteCampaign } = this.props;
    const params = {
      id,
    };
    this.setState({ isLoading: true });
    deleteCampaign(params, this.onSuccessDelete, this.onError);
  }

  handleCampaign() {
    const { totalCampaign, addCampaign, maxCampaign } = this.props;
    if (maxCampaign > totalCampaign) {
      addCampaign();
    } else {
      Alert.instance.showAlert(
        i18n.t('error'), i18n.t('campaignLimited', { maxCampaign }),
        i18n.t('OK'), () => Alert.instance.hideAlert(),
      );
    }
  }

  fetchListCampaigns() {
    const { currentPage } = this.state;
    const params = {
      currentPage,
      perPage: PER_PAGE,
    };
    this.props.fetchListCampaigns(this.onSuccess, this.onError, params);
  }

  renderCampaign() {
    const { listCampaigns, showBotDetail } = this.props;
    const listCampaignItem = listCampaigns.map(item => (
      <CampaignItemList
        campaignInfo={item}
        key={item._id}
        onClickDetail={() => showBotDetail(item)}
        handleDelete={this.handleDelete}
      />
    ));
    return listCampaignItem;
  }

  render() {
    const { currentPage } = this.state;
    const { totalCampaign } = this.props;

    return (
      <ContentContainer>
        <ContentHeader>
          {i18n.t('total').concat(': ', totalCampaign)}
          <ButtonAddCampaign onClick={this.handleCampaign}>
            <IconAdd src={images.add} alt="" />
            {i18n.t('addCampaign')}
          </ButtonAddCampaign>
        </ContentHeader>
        <MedianStrip />
        <ContentBody>
          {this.renderCampaign()}
          <Blank height={0.5} />
          {
            (totalCampaign > PER_PAGE) ? (
              <WrapperPaginationCustom>
                <Pagination
                  type="autoBot"
                  current={currentPage}
                  total={totalCampaign}
                  onChange={this.onChangePage}
                  pageSize={PER_PAGE}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1em',
                  }}
                />
              </WrapperPaginationCustom>
            ) : ''
          }
          <Blank height={0.5} />
          <Spinner isLoading={this.state.isLoading} />
        </ContentBody>
      </ContentContainer>
    );
  }
}

ListCampaign.defaultProps = {
  totalCampaign: 0,
};

ListCampaign.propTypes = {
  listCampaigns: PropTypes.array.isRequired,
  showBotDetail: PropTypes.func.isRequired,
  fetchListCampaigns: PropTypes.func.isRequired,
  addCampaign: PropTypes.func.isRequired,
  deleteCampaign: PropTypes.func.isRequired,
  fetchListPattern: PropTypes.func.isRequired,
  totalCampaign: PropTypes.number,
  maxCampaign: PropTypes.number.isRequired,
};

export default ListCampaign;
