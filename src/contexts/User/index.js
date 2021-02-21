import { createContext } from 'react';

import { setAuthorization } from '~/services/api';

let user = {};
if (typeof localStorage.tindev_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('tindev_user'));
  setAuthorization(user.token);
}

export const UserContext = createContext(user);
