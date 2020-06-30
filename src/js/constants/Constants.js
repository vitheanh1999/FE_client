import dayjs from 'dayjs';
import i18n from '../i18n/i18n';
import images from '../../assets/images';
import { ENABLE_NEWS } from '../config/localConfig';

export const TAB = {
  // CONNECT_TO_LUC: {
  //   name: i18n.t('connectToLuc'),
  //   key: 'connectToLuc',
  //   subTitle: '',
  //   value: 1,
  //   isShow: false,
  // },
  DASHBOARD: {
    name: i18n.t('dashBoard'),
    key: 'dashBoard',
    subTitle: '',
    value: 2,
    isShow: true,
    icon: images.iconWork,
  },
  REVENUE: {
    name: i18n.t('revenueGC'),
    key: 'revenue',
    subTitle: '',
    value: 3,
    isShow: true,
    icon: images.iconRevenue,
  },
  BOT: {
    name: i18n.t('autoBot'),
    key: 'autoBot',
    subTitle: 'スタートはこちら',
    value: 4,
    isShow: true,
    icon: images.iconBot,
  },
  CAMPAIGN: {
    name: i18n.t('menu.campaign'),
    key: 'menu.campaign',
    subTitle: '',
    value: 6,
    isShow: true,
    icon: images.iconCampaign,
  },
  CHARGE: {
    name: i18n.t('charge'),
    key: 'charge',
    subTitle: '',
    value: 7,
    isShow: true,
    icon: images.iconCharge,
  },
  NEWS: {
    name: i18n.t('news'),
    key: 'news',
    subTitle: '',
    value: 5,
    isShow: ENABLE_NEWS,
    icon: images.iconNotifyMenu,
  },
  GUIDE: {
    name: i18n.t('guide'),
    key: 'guide',
    subTitle: '',
    value: 8,
    isShow: true,
    icon: images.iconGuide,
  },
  TERMS: {
    name: i18n.t('terms'),
    key: 'terms',
    subTitle: '',
    value: 9,
    isShow: false,
  },
  POLICY: {
    name: i18n.t('policy'),
    key: 'policy',
    subTitle: '',
    value: 10,
    isShow: false,
  },
};

export const PER_PAGE = 10;
export const PER_PAGE_BOT_OFF = 18;
export const DEFAULT_DATE_DIFF = 9;
export const ALL_PAGE = 100;

export const NUMBER_GC_FOR_BOT = 1000000;

let MIN_DATE = '2019-11-15';
export const FORMAT_DATE = 'YYYY-MM-DD';
export const FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm';

const TimeZone = dayjs().utcOffset();
export const convertToLocalTime = time => dayjs(time).add(TimeZone, 'minute').format(FORMAT_DATE_TIME);

export const changeMinDate = (date) => {
  MIN_DATE = date;
};

export const getMinDate = () => MIN_DATE;

export const SORT_BOT_OPTIONS = [
  {
    id: -1,
    text: i18n.t('statusOnOff'),
    value: 'statusOnOff',
  },
  {
    id: 1,
    text: i18n.t('campaign'),
    value: 'campaign',
  },
  {
    id: 2,
    text: i18n.t('highLowGc'),
    value: 'gcHightLow',
  },
  {
    id: 3,
    text: i18n.t('lowHighGC'),
    value: 'gcLowHight',
  },
];

export const BOT_STATUSES = {
  ON: 1,
  OFF: 0,
};

export const BURST_STATUSES = {
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
};

export const VIDEO_QUALYTIES = {
  '480p': {
    id: 0, profile: 800000, value: 0, label: '480p',
  },
  '360p': {
    id: 1, profile: 400000, value: 1, label: '360p',
  },
  '240p': {
    id: 2, profile: 200000, value: 2, label: '240p',
  },
  Auto: {
    id: -1, profile: -1, value: -1, label: 'Auto',
  },
};

export const ZoomState = {
  zoomOut: 'out',
  zoomIn: 'in',
};
