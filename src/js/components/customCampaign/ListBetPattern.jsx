import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import i18n from '../../i18n/i18n';
import BetPatternItemList from './BetPatternItemList';

class ListBetPattern extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.onSuccessDelete = this.onSuccessDelete.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    this.fetchListBetPatternCustom();
  }

  onSuccessDelete(data) {
    const { listBetPattern, currentPage } = this.props;
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        Alert.instance.showAlert(i18n.t('success'), data.message);
        if (listBetPattern.length === 1 && currentPage !== 1) {
          this.fetchListBetPatternCustom(currentPage - 1);
        } else this.fetchListBetPatternCustom(currentPage);
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
      this.setState({ });
    }
  }

  fetchListBetPatternCustom(currentPage = 1) {
    this.props.fetchListBetPatternCustom(currentPage);
  }

  handleDelete(id) {
    const { deleteBetPattern } = this.props;
    const params = {
      id,
    };
    deleteBetPattern(params, this.onSuccessDelete, this.onError);
  }

  renderBetPattern() {
    const { listBetPattern, showPopupDetail } = this.props;
    return listBetPattern.map(item => (
      <BetPatternItemList
        betPatternInfo={item}
        key={item.id}
        showPopupDetail={showPopupDetail}
        handleDelete={this.handleDelete}
      />
    ));
  }

  render() {
    return (
      <Fragment>
        {this.renderBetPattern()}
      </Fragment>
    );
  }
}

ListBetPattern.propTypes = {
  listBetPattern: PropTypes.array.isRequired,
  fetchListBetPatternCustom: PropTypes.func.isRequired,
  showPopupDetail: PropTypes.func.isRequired,
  deleteBetPattern: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default ListBetPattern;
