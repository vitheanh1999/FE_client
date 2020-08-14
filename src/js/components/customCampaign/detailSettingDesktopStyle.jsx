import styled from 'styled-components';

export const Column = styled.div`
display: flex;
flex-direction: column;
flex: ${props => props.flex};
width: ${props => props.width}em;
`;

export const Row = styled.div`
  display: flex;
`;

export const Wrapper = styled(Row)`
  width: 100%;
  border-bottom: 1px solid #808080ab;
  align-items: flex-start;
  flex: 1;
`;
