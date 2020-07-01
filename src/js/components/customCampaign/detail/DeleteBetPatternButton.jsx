import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../../i18n/i18n';
import { images } from '../../../theme';
import Alert from '../../common/Alert/Alert';
import { ButtonAction } from '../../campaign/campaignStyle';

const onWarningDelete = () => {
  Alert.instance.showAlert(
    i18n.t('warning'),
    i18n.t('betPattern.cannotDelete'),
  );
};

class DeleteBetPatternButton extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }


  onDelete() {
    const { betPatternInfo, handleDelete } = this.props;
    const { id } = betPatternInfo;
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('deleteBetPatternConfirm'),
      [i18n.t('cancel'), i18n.t('ok')],
      [
        () => Alert.instance.hideAlert(),
        () => {
          handleDelete(id);
          Alert.instance.hideAlert();
        },
      ],
      Alert.instance.hideAlert(),
    );
  }

  render() {
    const { betPatternInfo } = this.props;
    return (
      <ButtonAction
        fontSize="1em"
        hoverBgColor="red"
        margin="0 0 0.7em 0"
        padding={isMobile ? '0.5em' : '0.2em 0.5em 0.2em 0.5em'}
        borderRadiusor={2}
        color="#dc3545"
        height={2}
        onClick={
          betPatternInfo.count_campaign_use_bet > 0
            ? () => onWarningDelete()
            : () => this.onDelete()
        }
      >
        <img src={images.deleteIcon} alt="view mode" id="view-mode-btn" />
      </ButtonAction>
    );
  }
}

DeleteBetPatternButton.propTypes = {
  betPatternInfo: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteBetPatternButton;
