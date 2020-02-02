const cloudinary = require('cloudinary').v2;

const DEFAULT_FLUID_MAX_WIDTH = 1000;
const DEFAULT_FLUID_MIN_WIDTH = 200;

exports.uploadImageNodeToCloudinary = async (node, options) => {
  const {cloudName, apiKey, apiSecret, uploadFolder, fluidMaxWidth = DEFAULT_FLUID_MAX_WIDTH, fluidMinWidth = DEFAULT_FLUID_MIN_WIDTH, breakpointsMaxImages = 5, createDerived = true} =  options;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try{
    const result = await cloudinary.uploader.upload(node.absolutePath, {
      folder: uploadFolder,
      public_id: node.name,
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
  }catch(e){
    throw e;
  }
};