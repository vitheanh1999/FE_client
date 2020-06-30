import styled from 'styled-components';

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WrapperVideo = styled(FlexColumn)`
  width: 100%;
  height: ${props => props.height}px;
  background-color: #333;
`;

export const BoxVideo = styled(FlexColumn)`
  background-color: #c4ae84;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;
