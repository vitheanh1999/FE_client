import styled from 'styled-components';
import {
  Notice, PayoutButton,
  GcArea, ContentArea, Wrapper,
} from './BotDetailStyle';

export const WrapperMobile = styled(Wrapper)`
  padding: 0;
  margin-top: 1em;
`;

export const ContentAreaMobile = styled(ContentArea)`
  background-color: #fff;
  margin-top: 1em;
`;

export const Chart = styled.div`
  padding: 5%;
`;

export const GcAreaMobile = styled(GcArea)`
  font-weight: 600;
  text-align: center;
  font-size: 1.5em;
`;

export const NoticeMobile = styled(Notice)`
  margin-left: 0;
`;

export const PayoutButtonMobile = styled(PayoutButton)`
  font-size: 0.9em;
`;

export const Background = styled.div`
  background-color: #f4f3f2;
  position: absolute;
  z-index: 1;
  width: 100%;
`;
