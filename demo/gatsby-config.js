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
          // {
          //   name: 'MarkdownRemarkFrontmatterHeroImage',
          //   cloudName: `cloudName`,
          //   publicId: `publicId`,
          // },
          {
            type: 'MarkdownRemarkFrontmatterHeroImageWithUnconformingShape',
            cloudName: `a_cloud_name`,
            publicId: (data) => {
              return data['a_public_id'];
            },
          },
        ],
      },
    },
  ],
};
