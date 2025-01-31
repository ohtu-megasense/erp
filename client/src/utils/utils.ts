const locale = "en-US";
const currency = "USD";

export const getLocaleCurrencyString = (value: number) => {
  return value.toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
};

export const getLocaleString = (value: number) => {
  return value.toLocaleString(locale);
};
