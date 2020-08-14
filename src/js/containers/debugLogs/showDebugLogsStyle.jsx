import styled from 'styled-components';

export const ButtonShowLog = styled.div`
  width: 4.3rem;
  height: 4.3rem;
  background-color: #fb0055;
  position: fixed;
  right: 0.7rem;
  bottom: 0.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  font-weight: bold;
  color: black;
  opacity: 0.7;
  z-index: 9999;
`;

export const ButtonReload = styled.div`
  width: 4.3rem;
  height: 4.3rem;
  background-color: #fb8600;
  position: fixed;
  right: 6rem;
  bottom: 0.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: black;
  opacity: 0.7;
  z-index: 9999;
`;

export const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

export const WrapperLog = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: scroll;
  overflow-x: hidden;
  padding: 0.5em 1em 0 1em;
`;

export const SearchWrapper = styled.div`
  justify-content: flex-end;
  display: flex;
  margin-right: 2em;
`;

export const InputText = styled.input`
  font-size: 1em;
  height: 2em;
  border-radius: 0.13334em;
  padding: 0.5em;
  padding-right: 1.5em;
  width: 15em;
`;

export const ImageClose = styled.img`
  width: 1em;
  height: 1em;
  position: absolute;
  right: 2.5em;
  top: 3em;
`;