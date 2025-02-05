const locale = 'en-US';
const currency = 'USD';

export const getLocaleCurrencyString = (value: number) => {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currency
  });
};

export const getLocaleString = (value: number) => {
  return value.toLocaleString(locale);
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max + 1);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
