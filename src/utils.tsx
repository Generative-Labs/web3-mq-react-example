export const getShortAddress = (address: string = '') => {
  let strLength = address.length;
  return address.substring(0, 5) + '...' + address.substring(strLength - 4, strLength);
};
