import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../../i18n/i18n';
import { images } from '../../../theme';
import Alert from '../../common/Alert/Alert';
import { ButtonAction } from '../campaignStyle';

class DeleteCampaignPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    const { campaignInfo, handleDelete } = this.props;
    const { _id: id } = campaignInfo;
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('deleteCampaignConfirm'),
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
    return (
      <div id="AAAAA">
        <ButtonAction
          fontSize="1em"
          hoverBgColor="red"
          margin="0 0 0.7em 0"
          padding={isMobile ? '0.5em' : '0.2em 0.5em 0.2em 0.5em'}
          borderRadiusor={2}
          color="#dc3545"
          height={2}
          onClick={() => this.onDelete()}
        >
          <img
            src={images.deleteIcon}
            alt="view mode"
            id="view-mode-btn"
          />
        </ButtonAction>
      </div>
    );
  }
}

DeleteCampaignPopup.propTypes = {
  campaignInfo: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteCampaignPopup;
