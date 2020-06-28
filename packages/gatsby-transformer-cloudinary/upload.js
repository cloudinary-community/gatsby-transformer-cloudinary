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

  //can we save on transformations if we do omit responsive_breakpoints?

  const result = await cloudinary.uploader.upload(url, {
    // overwrite: true,
    overwrite: false, // can we save on anything if we set this to false? no
    folder: uploadFolder,
    public_id: publicId,
    resource_type: 'image',
    // responsive_breakpoints: [
    //   {
    //     create_derived: createDerived, //can we save on transformations if this is false? no. this only saves storage.
    //     bytes_step: 20000,
    //     min_width: fluidMinWidth,
    //     max_width: fluidMaxWidth,
    //     max_images: breakpointsMaxImages,
    //   },
    // ],
  });
  console.log("exports.uploadImageToCloudinary -> result", result)
  return result;
};

exports.uploadImageNodeToCloudinary = async node => {
  const url = node.absolutePath;
  const publicId = node.name;
  const result = await exports.uploadImageToCloudinary({ url, publicId });
  return result;
};
