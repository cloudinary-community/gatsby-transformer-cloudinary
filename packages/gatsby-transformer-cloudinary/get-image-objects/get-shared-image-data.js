const axios = require('axios');
const { getPluginOptions } = require('../options');

const base64Cache = {};

// Create Cloudinary image URL with transformations.
exports.getImageURL = ({
  public_id,
  cloudName,
  transformations = [],
  chained = [],
  defaults,
  version = false,
}) => {
  const { defaultTransformations } = getPluginOptions();
  defaults = defaultTransformations || [];
  const baseURL = 'https://res.cloudinary.com/';
  const allTransformations = [transformations.concat(defaults).join()]
    .concat(chained)
    .join('/');

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
  public_id,
  version,
  cloudName,
  base64Transformations,
  transformations,
  base64Width,
  chained,
}) => {
  const b64Transformations = base64Transformations || transformations;
  const base64URL = exports.getImageURL({
    transformations: b64Transformations.concat(`w_${base64Width}`),
    public_id,
    version,
    cloudName,
    chained,
  });
  const base64 = await fetchBase64(base64URL);

  return base64;
};

const fetchBase64 = async url => {
  if (!base64Cache[url]) {
    const result = await axios.get(url, { responseType: 'arraybuffer' });
    const data = Buffer.from(result.data).toString('base64');
    base64Cache[url] = `data:image/jpeg;base64,${data}`;
  }

  return base64Cache[url];
};
