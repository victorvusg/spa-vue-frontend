export const saveToken = (tokenObj) => {
  localStorage.setItem('token', JSON.stringify(tokenObj));
};

export const getToken = () => {
  const storageToken = localStorage.getItem('token');
  if (!storageToken) return false;
  return JSON.parse(storageToken);
};

export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getSavedUser = () => {
  const storageUser = localStorage.getItem('user');
  if (!storageUser) return {};
  return JSON.parse(storageUser);
};

export const clearAuthentication = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
