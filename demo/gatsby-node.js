const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.createSchemaCustomization = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;

  const RemoteExampleType = `
      type RemoteExample implements Node  {
        remoteImageUrl: String!
        remoteImage: CloudinaryAsset @link(from: "fields.remoteImage" by: "id")
      }
    `;

  actions.createTypes([RemoteExampleType]);
};

exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest, getCache } =
    gatsbyUtils;
  const { createNode } = actions;

  const cloudinaryData1 = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
  };

  createNode({
    id: createNodeId(`ExistingData >>> 1`),
    name: 'Existing data 1',
    exampleImage: cloudinaryData1,
    nested: {
      exampleImage: cloudinaryData1,
    },
    internal: {
      type: 'ExistingData',
      contentDigest: createContentDigest(cloudinaryData1),
    },
  });

  reporter.info(`[site] Create ExistingData node # 1`);

  createNode({
    id: createNodeId(`GoodData >>> 1`),
    name: 'GoodData',
    ...cloudinaryData1,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest('GoodData' + cloudinaryData1),
    },
  });

  createNode({
    id: createNodeId(`BadData >>> 2`),
    name: 'BadData',
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest('BadData'),
    },
  });

  const cloudinaryData2 = {
    cloudName: 'jlengstorf',
    publicId: 'gatsby-cloudinary/jason',
    originalHeight: 3024,
    originalWidth: 4032,
    originalFormat: 'jpg',
  };

  createNode({
    id: createNodeId(`ExistingData >>> 2`),
    name: 'Existing data 2',
    exampleImage: cloudinaryData2,
    nested: {
      exampleImage: cloudinaryData2,
    },
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

  // Should NOT be uploaded to Cloudinary
  // since uploadSourceImageNames is set to ["images"]
  // and this will have uploadSourceImageNames = "__PROGRAMMATIC__"
  createRemoteFileNode({
    url: `https://images.unsplash.com/photo-1638913658179-18c9a9c943f7`,
    getCache,
    createNode,
    createNodeId,
  });
};

exports.onCreateNode = async (gatsbyUtils) => {
  const {
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    createContentDigest,
    reporter,
  } = gatsbyUtils;

  if (node.internal.type === 'RemoteExample') {
    const imageNode = await createRemoteImageNode({
      url: node.remoteImageUrl,
      parentNode: node,
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
    });

    createNodeField({ node: node, name: 'remoteImage', value: imageNode.id });
  }
};
