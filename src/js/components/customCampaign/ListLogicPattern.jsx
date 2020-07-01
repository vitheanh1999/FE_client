import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import i18n from '../../i18n/i18n';
import LogicPatternItem from './LogicPatternItem';
import Alert from '../common/Alert/Alert';

class ListLogicPattern extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.onSuccessDelete = this.onSuccessDelete.bind(this);
    this.renderLogic = this.renderLogic.bind(this);
  }

  componentDidMount() {
    this.fetchListLogicSetting();
  }

  onSuccessDelete(data) {
    const { listLogicSetting, currentPage } = this.props;
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        Alert.instance.showAlert(i18n.t('success'), data.message);
        if (listLogicSetting.length === 1 && currentPage !== 1) {
          this.fetchListLogicSetting(currentPage - 1);
        } else this.fetchListLogicSetting(currentPage);
      },
      () => { },
    );
  }

  handleDelete(id) {
    const { deleteLogicSetting } = this.props;
    const params = {
      id,
    };
    deleteLogicSetting(params, this.onSuccessDelete, this.onError);
  }

  fetchListLogicSetting(currentPage = 1) {
    this.props.fetchListLogicSetting(currentPage);
  }

  renderLogic() {
    const { listLogicSetting, showPopupDetail } = this.props;
    const listLogicItem = listLogicSetting && listLogicSetting.map(item => (
      <LogicPatternItem
        logicPatternInfo={item}
        key={item.id}
        handleDelete={this.handleDelete}
        showPopupDetail={showPopupDetail}
      />
    ));
    return listLogicItem;
  }

  render() {
    const listLogic = this.renderLogic();
    return (
      <Fragment>
        {listLogic}
      </Fragment>
    );
  }
}

ListLogicPattern.propTypes = {
  listLogicSetting: PropTypes.array.isRequired,
  fetchListLogicSetting: PropTypes.func.isRequired,
  showPopupDetail: PropTypes.func.isRequired,
  deleteLogicSetting: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};
export default ListLogicPattern;
