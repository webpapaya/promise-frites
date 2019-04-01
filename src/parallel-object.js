
export const parallelObject = (object = {}) => {
  const keys = Object.keys(object);
  const promises = keys.map((key) => object[key])
  return Promise.all(promises).then((values) => {
    return values.reduce((result, value, index) => {
      result[keys[index]] = value;
      return result;
    }, {});
  });
}