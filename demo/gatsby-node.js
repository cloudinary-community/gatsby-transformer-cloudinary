const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest, getCache } =
    gatsbyUtils;
  const { createNode } = actions;

  const cloudinaryData = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
  };

  createNode({
    id: createNodeId(`GoodData >>> 1`),
    name: 'GoodData',
    ...cloudinaryData,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(cloudinaryData),
    },
  });

  createNode({
    id: createNodeId(`BadData >>> 2`),
    name: 'BadData',
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest({}),
    },
  });

  const blogPostData1 = {
    title: 'Blog Post Example One',
    slug: 'post-1',
    heroImage: cloudinaryData,
  };

  createNode({
    ...blogPostData1,
    id: createNodeId(`BlogPost >>> 1`),
    internal: {
      type: 'BlogPost',
      contentDigest: createContentDigest(blogPostData1),
    },
  });

  reporter.info(`[site] Create BlogPost with existing asset # 1`);

  const articleData1 = {
    title: 'Article Example One',
    slug: 'article-1',
    feature: {
      image: cloudinaryData,
    },
  };

  createNode({
    ...articleData1,
    id: createNodeId(`Article >>> 1`),
    internal: {
      type: 'Article',
      contentDigest: createContentDigest(articleData1),
    },
  });

  reporter.info(`[site] Create Article with existing asset # 1`);

  const projectData1 = {
    name: 'Project Example One',
    slug: 'project-1',
    coverImageUrl:
      'https://images.unsplash.com/photo-1527685609591-44b0aef2400b',
  };

  createNode({
    ...projectData1,
    id: createNodeId(`Project >>> 1`),
    internal: {
      type: 'Project',
      contentDigest: createContentDigest(projectData1),
    },
  });

  reporter.info(`[site] Create Project with remote image url # 1`);

  const projectData2 = {
    name: 'Project Example Two',
    slug: 'project-2',
    coverImageUrl:
      'https://images.unsplash.com/photo-1631462685412-80a75dd611bc',
  };

  createNode({
    ...projectData2,
    id: createNodeId(`Project >>> 2`),
    internal: {
      type: 'Project',
      contentDigest: createContentDigest(projectData2),
    },
  });

  reporter.info(`[site] Create Project with remote image url # 2`);

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

  if (node.internal.type === 'Project' && node.coverImageUrl) {
    // Upload the image to Cloudinary
    const imageNode = await createRemoteImageNode({
      url: node.coverImageUrl,
      parentNode: node,
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
    });

    // Add node field to be used by "createSchemaCustomization"
    createNodeField({ node: node, name: 'coverImage', value: imageNode.id });
  }
};

exports.createSchemaCustomization = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;

  const ProjectType = `
      type Project implements Node  {
        coverImageUrl: String!
        coverImage: CloudinaryAsset @link(from: "fields.coverImage" by: "id")
      }
    `;

  actions.createTypes([ProjectType]);
};
