require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Gatsby Cloudinary Image Transformer`,
    description: `Demo of using the Gatsby Cloudinary image transformer with gatsby-plugin-image.`,
    author: `@jlengstorf`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
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
        ],
      },
    },
  ],
};
