const axios = require('axios');
const { getPluginOptions } = require('../options');

const base64Cache = {};
const getInfoCache = {};

// Create Cloudinary image URL with transformations.
exports.getImageURL = ({
  public_id,
  cloudName,
  transformations = [],
  chained = [],
  version = false,
  getInfo = false,
}) => {
  const baseURL = 'https://res.cloudinary.com/';

  const defaultTransformations = getPluginOptions().enableDefaultTransformations
    ? ['f_auto', 'q_auto']
    : [];
  const initialTransformations = transformations
    .concat(defaultTransformations)
    .join(',');
  const allTransformations = [initialTransformations].concat(chained).join('/');

  const imagePath = [
    cloudName,
    '/image/upload/',
    allTransformations,
    getInfo ? `/fl_getinfo` : '',
    version ? `/v${version}` : '',
    `/${public_id}`,
  ]
    .join('')
    .replace('//', '/');

  return baseURL + imagePath;
};

// Retrieve aspect ratio if in transformation else create aspect ratio values
exports.getAspectRatio = (transformations, originalAspectRatio) => {
  const arTransform = transformations.find((t) => t.startsWith('ar_'));
  if (!arTransform) {
    return originalAspectRatio;
  }

  const newAspectRatio = arTransform.replace('ar_', '');
  if (newAspectRatio.indexOf(':') === -1) {
    return Number(newAspectRatio);
  }

  const [w, h] = newAspectRatio.split(':').map(Number);

  return w / h;
};

exports.getBase64 = async ({
  base64Transformations,
  base64Width,
  chained,
  cloudName,
  defaultBase64,
  ignoreDefaultBase64,
  public_id,
  reporter,
  transformations,
  version,
}) => {
  if (defaultBase64) {
    if (!ignoreDefaultBase64 || getPluginOptions().alwaysUseDefaultBase64) {
      return defaultBase64;
    }
  }

  const b64Transformations = base64Transformations || transformations;
  const base64URL = exports.getImageURL({
    transformations: b64Transformations.concat(`w_${base64Width}`),
    public_id,
    version,
    cloudName,
    chained,
  });
  const base64 = await fetchBase64(base64URL, reporter);

  return base64;
};

async function fetchBase64(url, reporter) {
  if (!base64Cache[url]) {
    logBase64Retrieval(url, reporter);
    base64Cache[url] = axios.get(url, { responseType: 'arraybuffer' });
  }
  const response = await base64Cache[url];
  const data = Buffer.from(response.data).toString('base64');
  return `data:image/jpeg;base64,${data}`;
}

let fetchedBase64ImageCount = 0;

function logBase64Retrieval(url, reporter) {
  fetchedBase64ImageCount += 1;
  if (typeof reporter.info === 'function') {
    reporter.info(
      `[gatsby-transformer-cloudinary] Fetching base64 image ` +
        `#${fetchedBase64ImageCount} from Cloudinary: ${url}`
    );
    if (fetchedBase64ImageCount == 100) {
      reporter.info(
        '[gatsby-transformer-cloudinary] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
      );
      reporter.info(
        'It looks like your project has a lot of images. To improve your build times, '
      );
      reporter.info(
        'you should consider (1) using images that are already on Cloudinary, (2) '
      );
      reporter.info(
        'precomputing the base64 images and providing them to this plugin as the '
      );
      reporter.info(
        '`defaultBase64` property, and (3) setting the plugin option '
      );
      reporter.info(
        '`alwaysUseDefaultBase64` to true. Doing so will reduce the number of base64 '
      );
      reporter.info(
        'images that need to be fetched from Cloudinary and speed up your Gatsby "query" '
      );
      reporter.info(
        'build steps. (See the section "Use images already on Cloudinary" in the README.)'
      );
      reporter.info(
        '[gatsby-transformer-cloudinary] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
      );
    }
  }
}

exports.getSizingInfo = async ({ public_id, cloudName, version = false }) => {
  const getInfoUrl = this.getImageURL({
    public_id,
    cloudName,
    version,
    getInfo: true,
  });

  if (!getInfoCache[getInfoUrl]) {
    getInfoCache[getInfoUrl] = axios.get(getInfoUrl);
  }

  const { data } = await getInfoCache[getInfoUrl];
  return data.output;
};
