const axios = require('axios');
const { generateCloudinaryAssetUrl } = require('./generate-asset-url');

const cache = {};

const getData = async (url, options) => {
  if (!cache[url]) {
    cache[url] = axios.get(url, options);
  }

  const { data } = await cache[url];
  return data;
};

exports.getAssetAsTracedSvg = async ({ source, args }) => {
  const svgUrl = generateCloudinaryAssetUrl({
    publicId: source.publicId,
    cloudName: source.cloudName,
    format: 'svg',
    options: args,
    tracedSvg: {
      options: {
        colors: 2,
        detail: 0.3,
        despeckle: 0.1,
      },
      width: 300,
    },
  });
  const data = await getData(svgUrl);
  return `data:image/svg+xml,${encodeURIComponent(data)}`;
};

exports.getAssetMetadata = async ({ source, args }) => {
  const metaDataUrl = generateCloudinaryAssetUrl({
    publicId: source.publicId,
    cloudName: source.cloudName,
    options: args,
    flags: 'getinfo',
  });

  const data = await getData(metaDataUrl);
  return data.output;
};

exports.getUrlAsBase64Image = async (url) => {
  const data = await getData(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(data, 'binary').toString('base64');
  return `data:image/jpeg;base64,${base64}`;
};
