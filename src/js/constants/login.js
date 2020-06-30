import images from '../theme/images';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_DEMO = 'LOGIN_DEMO';

export const getLogo = (id) => {
  switch (id) {
    case 0:
      return images.Login.Logo0;
    case 1:
      return images.Login.Logo1;
    case 2:
      return images.Login.Logo2;
    case 3:
      return images.Login.Logo3;
    case 4:
      return images.Login.Logo4;
    case 5:
      return images.logoDBM;
    case 7:
      return images.Login.Logo7;
    case 8:
      return images.Login.Logo8;
    default:
      return images.Login.Logo1;
  }
};

export const getLogoMini = (id) => {
  switch (id) {
    case 0:
      return images.Login.LogoMini0;
    case 1:
      return images.Login.LogoMini1;
    case 2:
      return images.Login.LogoMini2;
    case 3:
      return images.Login.LogoMini3;
    case 4:
      return images.Login.LogoMini4;
    case 5:
      return images.Login.LogoMini5;
    case 7:
      return images.Login.Logo7;
    case 8:
      return images.Login.LogoMini8;
    default:
      return images.Login.LogoMini1;
  }
};

export const getLoginBackground = (id) => {
  switch (id) {
    case 0:
      return images.Login.LoginBg0;
    case 1:
      return images.Login.LoginBg1;
    case 2:
      return images.Login.LoginBg2;
    case 3:
      return images.Login.LoginBg3;
    case 4:
      return images.Login.LoginBg4;
    default:
      return images.Login.LoginBg0;
  }
};

export const CompanyInfo = {
  id: 0,
  name: 'Auto D-BAC',
  logo: getLogo(0),
  miniLogo: getLogoMini(0),
  url: 'dbac',
  color: '#002e38',
  background: getLoginBackground(0),
  provide: 'rcc',
};
