import styled from 'styled-components';
import { Modal } from 'reactstrap';
import { isMobile } from 'react-device-detect';
import { checkOrientation, ORIENTATION } from '../../helpers/system';
import { TABS } from '../../components/customCampaign/CardNoTable';

export const ModalWrapper = styled(Modal)`
  max-width: 40em;
  min-width: 40em;
  margin-left: auto;
  margin-right: auto;
  font-size: ${props => props.fontSize}px;
  margin-bottom: ${props => props.marginBot};

  > div {
    background-color: #333333;
    color: #fcfcfc;
  }
`;

export const Icon = styled.img`
  width: 1em;
  margin-left: 1em;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const listTabs = Object.values(TABS);

export const getPopupDetailFontSize = () => {
  const width = isMobile ? 0.95 : 0.85;
  const sizeW = width * window.innerWidth / 40;
  const sizeH = 0.7 * window.innerHeight / 31;
  const orient = checkOrientation();
  if (orient === ORIENTATION.Portrait) {
    return sizeW;
  }
  const ratio = window.innerWidth / window.innerHeight;
  if (ratio > 1) {
    return Math.max(10, sizeH);
  }
  return Math.max(10, sizeW);
};
