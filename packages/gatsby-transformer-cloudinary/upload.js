const cloudinary = require('cloudinary').v2;
const { getPluginOptions } = require('./options');

let totalImages = 0;
let uploadedImages = 0;

const FIVE_MINUTES = 5 * 60 * 1000;

exports.uploadImageToCloudinary = async ({
  url,
  publicId,
  reporter,
}) => {
  const {
    apiKey,
    apiSecret,
    breakpointsMaxImages,
    cloudName,
    createDerived,
    fluidMaxWidth,
    fluidMinWidth,
    uploadFolder,
    overwriteExisting,
    useCloudinaryBreakpoints,
  } = getPluginOptions();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const uploadOptions = {
    folder: uploadFolder,
    overwrite: overwriteExisting,
    public_id: publicId,
    resource_type: 'auto',
    timeout: FIVE_MINUTES,
  };

  // Each time we ask Cloudinary to calculate the responsive breakpoints for an
  // image, Cloudinary bills us for one transformation. Since this API call
  // gets called for every image every time our Gatsby cache gets cleared, this
  // can get expensive very fast. This option should not be used outside of
  // production. It's recommended that createDerived be set to true when
  // useCloudinaryBreakpoints is set to true.This will store the derived images
  // and prevent Cloudinary from using more transformations to recompute them
  // in the future.
  if (useCloudinaryBreakpoints) {
    uploadOptions.responsive_breakpoints = [
      {
        create_derived: createDerived,
        bytes_step: 20000,
        min_width: fluidMinWidth,
        max_width: fluidMaxWidth,
        max_images: breakpointsMaxImages,
      },
    ];
  }

  let attempts = 1;

  totalImages++;

  while (true) {
    try {
      const result = await cloudinary.uploader.upload(url, uploadOptions);
      uploadedImages++;
      if (
        uploadedImages == totalImages ||
        uploadedImages % Math.ceil(totalImages / 100) == 0
      )
        reporter.info(
          `[gatsby-transformer-cloudinary] Uploaded ${uploadedImages} of ${totalImages} images to Cloudinary. (${Math.round(
            (100 * uploadedImages) / totalImages,
          )}%)`,
        );
      return result;
    } catch (error) {
      const stringifiedError = JSON.stringify(error, null, 2);
      if (attempts < 3) {
        attempts += 1;
        reporter.warn(
          `An error occurred when uploading ${url} to Cloudinary: ${stringifiedError}`,
        );
      } else {
        reporter.panic(
          `Unable to upload ${url} to Cloudinary after ${attempts} attempts: ${stringifiedError}`,
        );
      }
    }
  }
};

exports.uploadImageNodeToCloudinary = async ({ node, reporter }) => {
  const url = node.absolutePath;
  const relativePathWithoutExtension = node.relativePath.replace(/\.[^.]*$/, "");
  const publicId = relativePathWithoutExtension;
  const result = await exports.uploadImageToCloudinary({
    url,
    publicId,
    reporter,
  });
  return result;
};
