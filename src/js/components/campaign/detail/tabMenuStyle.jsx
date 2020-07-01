import styled from 'styled-components';
// import colors from '../../../theme/colors';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex};
`;

export const Wrapper = styled(Row)`
  width: 100%;
  height: 2.5em;
  border-bottom: 1px solid #808080ab;
`;

export const TabButton = styled.div`
  cursor: pointer;
  padding-left: 1em;
  padding-right: 1em;
  min-width: 8em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fcfcfc;
  font-weight: 700;
  background-color: ${props => (props.selected ? '#000000e6' : '#333333')};
  border-bottom: 2px #2d889c;
  border-bottom-style: ${props => (props.selected ? 'solid' : 'none')};
  border-right: 1px #80808087;
  border-right-style: dashed;

  &: hover {
    background-color: #6c757d;
  }
`;
