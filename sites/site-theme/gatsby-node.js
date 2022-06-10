const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');

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

  const remoteImageUrl1 =
    'https://images.unsplash.com/photo-1654805540365-f5f7c81dfadf';

  createNode({
    id: createNodeId(`RemoteExample >>> 1`),
    name: 'Remote Example 1',
    remoteImageUrl: remoteImageUrl1,
    internal: {
      type: 'RemoteExample',
      contentDigest: createContentDigest(remoteImageUrl1),
    },
  });

  reporter.info(`[site] Create RemoteExample node # 1`);

  const remoteImageUrl2 =
    'https://images.unsplash.com/photo-1654795310460-78f58edf26ba';

  createNode({
    id: createNodeId(`RemoteExample >>> 2`),
    name: 'Remote Example 2',
    remoteImageUrl: remoteImageUrl2,
    internal: {
      type: 'RemoteExample',
      contentDigest: createContentDigest(remoteImageUrl2),
    },
  });

  reporter.info(`[site] Create RemoteExample node # 2`);
};

// gatsby-node.js

exports.onCreateNode = async (gatsbyUtils) => {
  const {
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    createContentDigest,
    reporter,
  } = gatsbyUtils;

  if (node.internal.type === 'RemoteExample') {
    await createRemoteImageNode({
      url: node.remoteImageUrl,
      parentNode: node,
      relationshipName: 'remoteImage',
      createNode,
      createNodeId,
      createContentDigest,
      createNodeField,
      reporter,
    });
  }
};
