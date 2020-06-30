import styled from 'styled-components';

// const isMobile = false;
export const Wrapper = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("${props => props.src}");
  background-repeat: repeat;
  font-size: ${props => props.fontSize}px;
  flex-direction: column;
`;

export const Copyright = styled.div`
  color: #fff;
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
`;

export const WrapperContent = styled.div`
  width: 40em;
  background-color: rgb(0, 0, 0, 0.4);
  color: #fff;
  padding: 3em;
  margin-bottom: 2em;
  font-size: 1em;
`;

export const WrapperLogo = styled.div`
  text-align: center;
`;

export const Logo = styled.img`
  width: 50%;
`;

export const Title = styled.div`
  font-size: 2.5em;
  text-align: center;
  font-weight: 700;
`;

export const Content = styled.div`
  height: 10em;
  word-wrap: break-word;
  overflow: auto;
  white-space: pre-wrap;
  text-align: center;
  margin-top: 1em;

  a {
    color: #05cdf9;
  }
`;

export const DurationTime = styled.div`
  margin-top: 1em;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  height: 0.5em;

  span {
    margin: 0 1em;
  }
`;
export const WrapperTop = styled.div`
  display: flex;
  justify-content: center;
`;
export const WrapperCenter = styled.div`
  position: absolute;
`;
