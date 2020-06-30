const securityActions = {
  login: {
    id: 1, actionCode: 'A01', name: 'Login', type: 2,
  },
  editMail: {
    id: 2, actionCode: 'A02', name: 'Edit email', type: 2,
  },
  editPhone: {
    id: 3, actionCode: 'A03', name: 'Edit phone number', type: 2,
  },
  activeSettingEmail: {
    id: 4, actionCode: 'A04', name: 'Active setting email', type: 1,
  },
  activeSettingPhone: {
    id: 5, actionCode: 'A05', name: 'Active setting text', type: 1,
  },
  activeSettingApp: {
    id: 6, actionCode: 'A06', name: 'Active setting app', type: 1,
  },
  disableSettingEmail: {
    id: 7, actionCode: 'A07', name: 'Disable setting email', type: 2,
  },
  disableSettingPhone: {
    id: 8, actionCode: 'A08', name: 'Disable setting text', type: 2,
  },
  disableSettingApp: {
    id: 9, actionCode: 'A09', name: 'Disable setting app', type: 2,
  },
  gcShop: {
    id: 10, actionCode: 'A10', name: 'GC Shop', type: 2,
  },
};
export default securityActions;
