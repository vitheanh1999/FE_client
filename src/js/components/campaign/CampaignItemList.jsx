import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import {
  WrapperAction, ButtonAction, FieldText,
  Title, Row, FieldTitle,
  Image,
} from './campaignStyle';
import {
  WrapperListItem, ListInformation,
} from '../common/CommonStyle';
import DeleteCampaignPopup from './detail/DeleteCampaignPopup';

const ENABLE_DELETE_CAMPAIGN = true;

const renderField = (title, value) => (
  <Row>
    <FieldTitle>{title}</FieldTitle>
    <FieldText>{value}</FieldText>
  </Row>
);

class CampaignItemList extends PureComponent {
  renderAction() {
    const { campaignInfo, onClickDetail, handleDelete } = this.props;
    const buttonDelete = ENABLE_DELETE_CAMPAIGN && (
      <DeleteCampaignPopup
        handleDelete={handleDelete}
        campaignInfo={campaignInfo}
      />
    );

    return (
      <Fragment>
        <ButtonAction
          fontSize="1em"
          hoverBgColor="#20bcdf"
          padding={isMobile ? '0.5em' : '0.2em 0.5em 0.2em 0.5em'}
          opacity="0.5"
          margin="0 1em 0.7em 0"
          color="#2d889c"
          height={2}
          onClick={onClickDetail}
        >
          {isMobile || i18n.t('edit')}
          <Image src={images.edit2} alt="" />
        </ButtonAction>
        {buttonDelete}
      </Fragment>
    );
  }

  render() {
    const { campaignInfo } = this.props;

    return (
      <WrapperListItem >
        <ListInformation>
          <Title>{campaignInfo.name}</Title>
          {
            renderField(i18n.t('logicPattern'),
              campaignInfo && campaignInfo.data && campaignInfo.data.components
                && campaignInfo.data.components.length ? campaignInfo.data.components[0].logic_pattern_name : 'non-select')
          }
          {
            renderField(i18n.t('betPattern'),
              campaignInfo && campaignInfo.data && campaignInfo.data.components
                && campaignInfo.data.components.length ? campaignInfo.data.components[0].bet_pattern_name : 'non-select')
          }
        </ListInformation>
        <WrapperAction>
          {this.renderAction()}
        </WrapperAction>
      </WrapperListItem>
    );
  }
}

CampaignItemList.defaultProps = {
  onClickDetail: null,
};

CampaignItemList.propTypes = {
  campaignInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  onClickDetail: PropTypes.func,
  handleDelete: PropTypes.func.isRequired,
};

export default CampaignItemList;
