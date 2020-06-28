const path = require('path');
const { uploadImageToCloudinary } = require('./upload');
const { createImageNode } = require('./create-image-node');

exports.createRemoteImageNode = async ({
  url,
  parentNode,
  relationshipName,
  createContentDigest,
  createNode,
  createNodeId,
  reporter,
}) => {
  if (!relationshipName) {
    throw Error("'relationshipName' is a required argument.");
  }
  if (relationshipName === 'CloudinaryAsset') {
    throw Error(
      "'relationshipName' cannot be 'CloudinaryAsset'. That name is reserved.",
    );
  }

  const publicId = path.parse(url).name;

  // const cloudinaryUploadResult = await uploadImageToCloudinary({
  //   url,
  //   publicId,
  // });

  const cloudinaryUploadResult = await benchmark(
    () => uploadImageToCloudinary({ url, publicId }),
    reporter,
    url,
  );

  return createImageNode({
    relationshipName,
    cloudinaryUploadResult,
    parentNode,
    createContentDigest,
    createNode,
    createNodeId,
  });
};

async function benchmark(fn, reporter, tag) {
  const start = new Date();
  const result = await fn();
  const stop = new Date();
  reporter.info(`Elapsed time: ${stop - start} ms (${tag})`);
  return result;
}
