export const currencyFormat = (value, shortTerm, passedUnit) => {
  const unit = passedUnit || 'đ';
  if (shortTerm) {
    return `${value}k`;
  }
  return `${Number(value * 1000).toLocaleString()} ${unit}`;
};
export const coinFormat = (value) => `${value.toLocaleString('en')} Xu`;
