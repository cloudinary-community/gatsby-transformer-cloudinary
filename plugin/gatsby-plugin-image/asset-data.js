const axios = require('axios');
const probe = require('probe-image-size');
const { generateCloudinaryAssetUrl } = require('./generate-asset-url');

const dataCache = {};
const probeCache = {};

const getData = async (url, options) => {
  if (!dataCache[url]) {
    dataCache[url] = axios.get(url, options);
  }

  const { data } = await dataCache[url];
  return data;
};

const probeImage = async (url) => {
  if (!probeCache[url]) {
    probeCache[url] = probe(url);
  }

  return await probeCache[url];
};

exports.getAssetAsTracedSvg = async ({ cldAssetData, args }) => {
  const svgUrl = generateCloudinaryAssetUrl({
    format: 'svg',
    cldAssetData: cldAssetData,
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

exports.getAssetMetadata = async ({ cldAssetData, args }) => {
  const metaDataUrl = generateCloudinaryAssetUrl({
    cldAssetData: cldAssetData,
    options: args,
  });

  const result = await probeImage(metaDataUrl);
  return {
    width: result.width,
    height: result.height,
    format: result.type,
  };
};

exports.getUrlAsBase64Image = async (url) => {
  const data = await getData(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(data, 'binary').toString('base64');
  return `data:image/jpeg;base64,${base64}`;
};
