exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  const cloudinaryData1 = {
    cloudinaryAssetData: true,
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
    originalHeight: 576,
    originalWidth: 864,
  };

  createNode({
    id: createNodeId(`ExistingData >>> 1`),
    name: 'Existing data 1',
    exampleImage: cloudinaryData1,
    internal: {
      type: 'ExistingData',
      contentDigest: createContentDigest(cloudinaryData1),
    },
  });

  reporter.info(`[site] Create ExistingData node # 1`);

  const cloudinaryData2 = {
    cloudinaryAssetData: true,
    cloudName: 'jlengstorf',
    publicId: 'gatsby-cloudinary/jason',
    originalHeight: 3024,
    originalWidth: 4032,
  };

  createNode({
    id: createNodeId(`ExistingData >>> 2`),
    name: 'Existing data 2',
    exampleImage: cloudinaryData2,
    internal: {
      type: 'ExistingData',
      contentDigest: createContentDigest(cloudinaryData2),
    },
  });

  reporter.info(`[site] Create ExistingData node # 2`);
};
