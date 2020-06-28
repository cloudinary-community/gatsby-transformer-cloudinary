const cloudinary = require('cloudinary').v2;
const { getPluginOptions } = require('./options');

exports.uploadImageToCloudinary = async ({ url, publicId }) => {
  const {
    cloudName,
    apiKey,
    apiSecret,
    uploadFolder,
    fluidMaxWidth,
    fluidMinWidth,
    breakpointsMaxImages,
    createDerived,
  } = getPluginOptions();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const result = await cloudinary.uploader.upload(url, {
    overwrite: false,
    folder: uploadFolder,
    public_id: publicId,
    resource_type: 'auto',
    responsive_breakpoints: [
      {
        create_derived: createDerived,
        bytes_step: 20000,
        min_width: fluidMinWidth,
        max_width: fluidMaxWidth,
        max_images: breakpointsMaxImages,
      },
    ],
  });
  return result;
};

exports.uploadImageNodeToCloudinary = async (node) => {
  const url = node.absolutePath;
  const publicId = node.name;
  const result = await exports.uploadImageToCloudinary({ url, publicId });
  return result;
};
