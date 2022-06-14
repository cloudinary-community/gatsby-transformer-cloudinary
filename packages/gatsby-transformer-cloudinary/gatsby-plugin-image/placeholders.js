const axios = require('axios');

const base64Cache = {};

exports.getBase64Image = async (url) => {
  if (!base64Cache[url]) {
    base64Cache[url] = axios
      .get(url, { responseType: 'arraybuffer' })
      .then(({ data }) => {
        const base64 = Buffer.from(data, 'binary').toString('base64');
        console.log('>>>> base64', url);
        return `data:image/jpeg;base64,${base64}`;
      });
  }
  return base64Cache[url];
};
