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

export const getPickupDateString = (value: number) => {
  const date = new Date(value);
  const timeString = date.toLocaleTimeString(locale);
  const dateString = date.toLocaleDateString(locale);
  const hhmm = timeString.split(":").slice(0, 2).join(":");
  const pm = timeString.split(" ")[1];
  return `Pickup on ${dateString} at ${hhmm} ${pm}`;
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max + 1);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
