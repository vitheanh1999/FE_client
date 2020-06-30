import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  padding-left: 1em;
  padding-right: 1em;
  height: fit-content;
`;

export const Cell = styled.div`
  flex: ${props => props.flex};
  height: 100%;
`;

export const LeftCell = styled(Cell)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0.5em;
`;

export const Logo = styled.img`
  width: 84%;
`;

export const CenterCell = styled(Cell)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  width: 100%;
  height: 62%;
  border-radius: 0.2em;
  background-color: #dee3e4;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const RightCell = styled(Cell)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

export const MenuButton = styled.img`
  width: 22%;
`;
