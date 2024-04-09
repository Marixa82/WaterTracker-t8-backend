export const dateSeparator = (date) => {
  let sep;
  if (date.includes("/")) sep = "/";
  else if (date.includes("-")) sep = "-";
  const [day, month, year] = date.split(sep);
  if (day === null || day === undefined) {
    return [month, year];
  }
  return [day, month, year];
};
