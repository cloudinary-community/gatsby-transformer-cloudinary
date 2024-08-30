const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest, getCache } =
    gatsbyUtils;
  const { createNode } = actions;

  const variedData = [
    {
      name: 'No assed info',
      expected: 'No image',
    },
    {
      name: 'Non existing asset without metadata',
      expected: 'No image',
      cloudName: 'not-a-good-cloudName',
      publicId: 'sample',
    },
    {
      name: 'Non existing asset with metadata',
      expected: 'Broken image',
      cloudName: 'not-a-good-cloudName',
      publicId: 'sample',
      originalHeight: 400,
      originalWidth: 300,
      originalFormat: 'png',
    },
    {
      name: 'Asset without metadata',
      expected: 'Rastered image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'sample',
    },
    {
      name: 'Asset with metadata',
      expected: 'Rastered image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'sample',
      originalWidth: 864,
      originalHeight: 576,
      // No originalFormat
      // originalFormat: 'jpg',
    },
    {
      name: 'Video without metadata',
      expected: 'No image - in future: rastered image ',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse mime types/chop-chop-video.mp4',
    },
    {
      name: 'Video with metadata',
      expected: 'Broken image - in future: rastered image ',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse mime types/chop-chop-video.mp4',
      originalHeight: 1800,
      originalWidth: 1800,
      originalFormat: 'mp4',
    },
    {
      name: 'Video with metadata - jpg',
      expected: 'Broken image - in future: rastered image ',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse mime types/chop-chop-video.mp4',
      originalHeight: 1800,
      originalWidth: 1800,
      originalFormat: 'jpg',
    },
    {
      name: 'Gif without metadata',
      expected: 'Animated image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/giphyCat.gif',
    },
    {
      name: 'Gif with metdata',
      expected: 'Animated image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/giphyCat.gif',
      originalWidth: 480,
      originalHeight: 315,
      originalFormat: 'gif',
    },
    {
      name: 'Gif with metdata - png',
      expected: 'Animated image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/giphyCat.gif',
      originalWidth: 480,
      originalHeight: 315,
      // Wrong original format
      originalFormat: 'png',
    },
    {
      name: 'Pdf without metadata',
      expected: 'Rastered image of first page',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
    },
    {
      name: 'Pdf with metadata',
      expected: 'Rastered image of first page',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
      originalWidth: 1650,
      originalHeight: 1275,
      originalFormat: 'pdf',
    },
    {
      name: 'Pdf with metadata - jpg',
      expected: 'Rastered image of first page',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/en-US-YearCompass-booklet.pdf',
      originalWidth: 1650,
      originalHeight: 1275,
      // Wrong original format
      originalFormat: 'jpg',
    },
    {
      name: 'Svg without metdata',
      expected: 'Rastered image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/bubble-gum-ice-skating.svg',
    },
    {
      name: 'Svg with metdata',
      expected: 'Rastered image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/bubble-gum-ice-skating.svg',
      originalHeight: 3000,
      originalWidth: 3000,
      originalFormat: 'svg',
    },
    {
      name: 'Svg with metdata - png',
      expected: 'Rastered image',
      cloudName: 'lilly-labs-consulting',
      publicId: 'diverse%20mime%20types/bubble-gum-ice-skating.svg',
      originalHeight: 3000,
      originalWidth: 3000,
      // Wrong original format
      originalFormat: 'png',
    },
  ];

  variedData.forEach((asset, key) => {
    createNode({
      id: createNodeId(`VariedData >>> ${key}`),
      ...asset,
      internal: {
        type: 'VariedData',
        contentDigest: createContentDigest(asset),
      },
    });

    reporter.info(`[site] Create VariedData: ${asset.name}`);
  });

  const emptyData = [
    { name: 'Empty data', expected: 'No image', cloudinary: {} },
    { name: 'Undefined data', expected: 'No image', cloudinary: undefined },
    { name: 'Null data', expected: 'No image', cloudinary: null },
    {
      name: 'Non empty data',
      expected: 'An image',
      cloudinary: { cloudName: 'lilly-labs-consulting', publicId: 'sample' },
    },
  ];

  emptyData.forEach((asset, key) => {
    createNode({
      id: createNodeId(`EmptyData >>> ${key}`),
      ...asset,
      internal: {
        type: 'EmptyData',
        contentDigest: createContentDigest(asset),
      },
    });

    reporter.info(`[site] Create EmptyData: ${key}`);
  });

  const sampleAsset = {
    name: 'Asset with metadata',
    cloudName: 'lilly-labs-consulting',
    publicId: 'sample',
    originalWidth: 864,
    originalHeight: 576,
    originalFormat: 'jpg',
  };

  const blogPostData1 = {
    title: 'Blog Post Example One',
    slug: 'post-1',
    heroImage: sampleAsset,
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
      image: sampleAsset,
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

  // To test root config
  const secureDistributionData1 = {
    title: 'Secure Distribution Example One',
    slug: 'secure-1',
    cloudName: 'lilly-labs-consulting',
    public: 'sample',
    width: 864,
    originalHeight: 576,
    originalFormat: 'jpg',
  };

  createNode({
    ...secureDistributionData1,
    id: createNodeId(`SecureDistribution >>> 1`),
    internal: {
      type: 'SecureDistribution',
      contentDigest: createContentDigest(secureDistributionData1),
    },
  });

  reporter.info(`[site] Create SecureDistribution with existing asset # 1`);

  const cnameData1 = {
    title: 'Cname (unsecure) Example One',
    slug: 'cname-1',
    cloud_name: 'lilly-labs-consulting',
    public_id: 'sample',
    metadata: {
      width: 864,
      height: 576,
      format: 'jpg',
    },
  };

  createNode({
    ...cnameData1,
    id: createNodeId(`Cname >>> 1`),
    internal: {
      type: 'Cname',
      contentDigest: createContentDigest(cnameData1),
    },
  });

  reporter.info(`[site] Create Cname with existing asset # 1`);

  const privateCdn1 = {
    title: 'Private CDN Example One',
    slug: 'private-cdn-1',
    cloud_name: 'lilly-labs-consulting',
    public_id: 'sample',
    width: 864,
    height: 576,
    format: 'jpg',
  };

  createNode({
    ...privateCdn1,
    id: createNodeId(`PrivateCDN >>> 1`),
    internal: {
      type: 'PrivateCDN',
      contentDigest: createContentDigest(privateCdn1),
    },
  });

  reporter.info(`[site] Create PrivateCDN with existing asset # 1`);

  const privateCdnUnsecure1 = {
    title: 'Private CDN Unsecure Example One',
    slug: 'private-cdn-unsecure-1',
    cloud_name: 'lilly-labs-consulting',
    secure: false,
    privateCdn: true,
    public_id: 'sample',
    width: 864,
    height: 576,
    format: 'jpg',
  };

  createNode({
    ...privateCdnUnsecure1,
    id: createNodeId(`PrivateCDNUnsecure >>> 1`),
    internal: {
      type: 'PrivateCDNUnsecure',
      contentDigest: createContentDigest(privateCdnUnsecure1),
    },
  });

  reporter.info(`[site] Create PrivateCDNUnsecure with existing asset # 1`);
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
