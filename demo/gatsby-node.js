const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest, getCache } =
    gatsbyUtils;
  const { createNode } = actions;

  const cloudinaryData1 = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
  };

  createNode({
    id: createNodeId(`BlogPost >>> 1`),
    name: 'Blog Post One',
    heroImage: cloudinaryData1,
    internal: {
      type: 'BlogPost',
      contentDigest: createContentDigest(cloudinaryData1),
    },
  });

  reporter.info(`[site] Create BlogPost node # 1`);

  createNode({
    id: createNodeId(`Article >>> 1`),
    name: 'Article One',
    feature: {
      image: cloudinaryData1,
    },
    internal: {
      type: 'Article',
      contentDigest: createContentDigest(cloudinaryData1),
    },
  });

  reporter.info(`[site] Create Article node # 1`);

  const remoteImageUrl1 =
    'https://images.unsplash.com/photo-1527685609591-44b0aef2400b';

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
    'https://images.unsplash.com/photo-1631462685412-80a75dd611bc';

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
