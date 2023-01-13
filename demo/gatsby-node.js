const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest, getCache } =
    gatsbyUtils;
  const { createNode } = actions;

  const existingAssetsWithoutMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 1`),
    name: 'GoodData',
    ...existingAssetsWithoutMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingAssetsWithoutMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with existing asset without metadata`
  );

  const noAssetInfo = {};

  createNode({
    id: createNodeId(`SomeBadImageData >>> 2`),
    name: 'NoAssetInfo',
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(noAssetInfo),
    },
  });

  reporter.info(`[site] Create SomeBadImageData without asset info`);

  const nonExistingAsset = {
    cloudName: 'not-a-good-cloudName',
    publicId: 'sample',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 3`),
    name: 'BadMetaData',
    ...nonExistingAsset,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(nonExistingAsset),
    },
  });

  reporter.info(`[site] Create SomeBadImageData with nonexisting asset`);

  const existingVideoWithoutMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse mime types/chop-chop-video.mp4',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 4`),
    name: 'ExistingVideoWithoutMetadata',
    ...existingVideoWithoutMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingVideoWithoutMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with existing video asset without metadata`
  );

  const existingGifWithoutMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse%20mime%20types/giphyCat.gif',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 5`),
    name: 'ExistingGifWithoutMetadata',
    ...existingGifWithoutMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingGifWithoutMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with gif asset without metadata`
  );

  const existingGifWithMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse%20mime%20types/giphyCat.gif',
    originalWidth: 480,
    originalHeight: 315,
    originalFormat: 'gif',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 6`),
    name: 'ExistingGifWithMetadata',
    ...existingGifWithMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingGifWithMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with gif asset without metadata`
  );

  const existingPdfWithoutMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 7`),
    name: 'ExistingPDFWithoutMetadata',
    ...existingPdfWithoutMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingPdfWithoutMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with pdf asset without metadata`
  );

  const existingPdfWithPDFMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
    originalWidth: 1650,
    originalHeight: 1275,
    originalFormat: 'pdf',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 8`),
    name: 'ExistingPdfWithPDFMetadata',
    ...existingPdfWithPDFMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingPdfWithPDFMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with pdf asset with pdf metadata`
  );

  const existingPdfWithPNGMetadata = {
    cloudName: 'lilly-labs-consulting',
    publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
    originalWidth: 1650,
    originalHeight: 1275,
    originalFormat: 'png',
  };

  createNode({
    id: createNodeId(`SomeBadImageData >>> 9`),
    name: 'ExistingPdfWithPNGMetadata',
    ...existingPdfWithPNGMetadata,
    internal: {
      type: 'SomeBadImageData',
      contentDigest: createContentDigest(existingPdfWithPNGMetadata),
    },
  });

  reporter.info(
    `[site] Create SomeBadImageData with pdf asset with png metadata`
  );

  const blogPostData1 = {
    title: 'Blog Post Example One',
    slug: 'post-1',
    heroImage: existingAssetsWithoutMetadata,
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
      image: existingAssetsWithoutMetadata,
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
