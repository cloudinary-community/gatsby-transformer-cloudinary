require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Gatsby Cloudinary Image Transformer`,
    description: `Demo of using the Gatsby Cloudinary image transformer with gatsby-plugin-image.`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/content/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/content/manual-tests`,
      },
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-image`,
    },
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        uploadFolder: process.env.GATSBY_CLOUDINARY_UPLOAD_FOLDER,
        uploadSourceInstanceNames: ['images'],
        transformTypes: [
          'CloudinaryAsset',
          'ArticleFeatureImage',
          'BlogPostHeroImage',
          'VariedData',
          'EmptyDataCloudinary',
          'MarkdownRemarkFrontmatterHeroImage',
          {
            type: 'MarkdownRemarkFrontmatterHeroImageWithUnconformingShape',
            cloudName: `lilly-labs-consulting`,
            mapping: {
              publicId: 'a_public_id',
            },
          },
          {
            type: 'SecureDistribution',
            secureDistribution: `example.com`,
            // secure: true,
            publicId: (data) => data.public,
          },
          {
            type: 'Cname',
            cname: `example.com`,
            secure: false,
            format: (data) => data.metadata.format,
            mapping: {
              width: (data) => data.metadata.width,
              height: (data) => data.metadata.height,
            },
          },
          {
            type: 'PrivateCDN',
            privateCdn: true,
            secure: true,
          },
          {
            type: 'PrivateCDNUnsecure',
            // Configured in the source date
          },
        ],
      },
    },
  ],
};
