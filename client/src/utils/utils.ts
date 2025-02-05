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

export const getLocaleTimeString = (date: Date) => {
  return date.toLocaleString(locale);
};

export const getRequestTimeString = (value: number) => {
  const date = new Date(value);
  const timeString = date.toLocaleTimeString(locale);
  const dateString = date.toLocaleDateString(locale);

  const pm = timeString.split(' ')[1];
  const isPmDefined = pm !== undefined;
  const splitSymbol = isPmDefined ? ':' : '.';

  const hhmm = timeString.split(splitSymbol).slice(0, 2).join(':');
  const baseText = `Request time on ${dateString} at ${hhmm}`;

  if (isPmDefined) {
    return `${baseText} ${pm}`;
  }

  return baseText;
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max + 1);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
