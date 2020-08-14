import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import Alert from '../common/Alert/Alert';
import { ButtonAction } from '../campaign/campaignStyle';

const warningDelete = (e) => {
  Alert.instance.showAlert(
    i18n.t('warning'),
    i18n.t('customCampaign.canNotDelete'),
    Alert.instance.hideAlert(),
  );
  e.stopPropagation();
};

class DeleteLogicPatternButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(e) {
    const { logicPatternInfo, handleDelete } = this.props;
    const { id, logic_pattern_name } = logicPatternInfo;
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('customCampaign.DeleteLogic').replace('param', logic_pattern_name),
      [i18n.t('cancel'), i18n.t('yes')],
      [
        () => Alert.instance.hideAlert(),
        () => {
          handleDelete(id);
          Alert.instance.hideAlert();
        },
      ],
      Alert.instance.hideAlert(),
    );
    e.stopPropagation();
  }

  render() {
    // const { logicPatternInfo } = this.props;
    return (
      <ButtonAction
        fontSize="1em"
        hoverBgColor="red"
        margin="0 0 0.7em 0"
        padding={isMobile ? '0.5em' : '0.2em 0.5em 0.2em 0.5em'}
        borderRadiusor={2}
        color="#dc3545"
        height={2}
        onClick={e => this.onDelete(e)}
      >
        <img
          src={images.deleteIcon}
          alt="view mode"
          id="view-mode-btn"
        />
      </ButtonAction>
    );
  }
}

DeleteLogicPatternButton.propTypes = {
  // campaignInfo: PropTypes.object.isRequired,
  // logicPatternInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteLogicPatternButton;
