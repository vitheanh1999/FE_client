import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex || 'unset'};
  width: 100%;
  background-color: ${props => props.backgroundColor};
  ${props => props.color && `color: ${props.color};`}
  height: ${props => props.height || 'unset'};
  min-height: 2em;
`;

export const HeaderCell = styled.div`
  display: flex;
  width: ${props => props.width};
  height: ${props => props.height};
  border-width: 1px;
  border-right-width: 0;
  ${props => props.flex && 'flex: 1;'}
  ${props => props.lastColum && 'border-right-width: 1px;'};
  border-color: black;
  border-style: solid;
  box-sizing: border-box;
  position: relative;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: white;
  text-align: center;
`;

export const ButtonOK = styled.div`
  background-color: ${props => (props.isDisableAdd ? '#ccc' : '#23b083')};
  border-radius: 0.2em;
  width: 9em;
  padding: 0.3em 0;
  font-weight: bold;
  cursor: ${props => (props.isDisableAdd ? 'not-allowed' : 'pointer')};
  margin: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    background-color: ${props => (props.isDisableAdd ? '#ccc' : '#23b083aa')};
  }
`;

export const ButtonDelete = styled.div`
  background-color: ${props => (props.isDisableDelete ? '#ccc' : '#d83f16')};
  border-radius: 0.2em;
  width: 9em;
  padding: 0.3em 0;
  font-weight: bold;
  cursor: ${props => (props.isDisableDelete ? 'not-allowed' : 'pointer')};
  margin: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    background-color: ${props => (props.isDisableDelete ? '#ccc' : '#d65735')};
  }
`;

export const BlankFlex = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
  flex: 1;
`;
