import { REGISTER } from '../constants/register';

export const register = (
  email,
  password,
  confirmPassword,
  onSuccess,
  onError,
) => ({
  type: REGISTER,
  email,
  password,
  confirmPassword,
  onSuccess,
  onError,
});

export const foo = () => ({});
