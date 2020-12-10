const axios = require('axios');
const { getPluginOptions } = require('../options');

const base64Cache = {};

// Create Cloudinary image URL with transformations.
exports.getImageURL = ({
  public_id,
  cloudName,
  transformations = [],
  chained = [],
  version = false,
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
    version ? `/v${version}/` : '/',
    public_id,
  ]
    .join('')
    .replace('//', '/');

  return baseURL + imagePath;
};

// Retrieve aspect ratio if in transformation else create aspect ratio values
exports.getAspectRatio = (transformations, originalAspectRatio) => {
  const arTransform = transformations.find(t => t.startsWith('ar_'));
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
    const result = await axios.get(url, { responseType: 'arraybuffer' });
    const data = Buffer.from(result.data).toString('base64');
    base64Cache[url] = `data:image/jpeg;base64,${data}`;
  }

  return base64Cache[url];
}

let fetchedBase64ImageCount = 0;

function logBase64Retrieval(url, reporter) {
  fetchedBase64ImageCount += 1;
  if (typeof reporter.info === 'function') {
    reporter.info(
      `[gatsby-transformer-cloudinary] Fetching base64 image ` +
        `#${fetchedBase64ImageCount} from Cloudinary: ${url}`,
    );
  }
}
