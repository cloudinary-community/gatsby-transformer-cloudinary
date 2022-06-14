const axios = require('axios');

const placeholderCache = {};

exports.getBase64Image = async (url) => {
  if (!placeholderCache[url]) {
    placeholderCache[url] = axios
      .get(url, { responseType: 'arraybuffer' })
      .then(({ data }) => {
        const base64 = Buffer.from(data, 'binary').toString('base64');
        console.log('>>>> base64', url);
        return `data:image/jpeg;base64,${base64}`;
      });
  }
  return placeholderCache[url];
};

exports.getSvgImage = async (url) => {
  if (!placeholderCache[url]) {
    placeholderCache[url] = axios.get(url).then(({ data }) => {
      console.log('>>>> svg', url);
      return `data:image/svg+xml,${encodeURIComponent(data)}`;
    });
  }
  return placeholderCache[url];
};
