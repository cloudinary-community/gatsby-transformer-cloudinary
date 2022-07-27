import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// Both gatsby-image and gatsby-plugin-image is supported
// gatsby-image is deprecated, use gatsby-plugin-image for new projects
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Image from 'gatsby-image';

const SingleImage = () => {
  const data = useStaticQuery(graphql`
    query ExampleQuery {
      cloudinaryAsset(publicId: { eq: "gatsby-cloudinary/jason" }) {
        fixed(width: 300) {
          ...CloudinaryAssetFixed
        }
        gatsbyImageData(width: 300, layout: FIXED)
      }
    }
  `);

  const image = getImage(data.cloudinaryAsset);

  return (
    <>
      <GatsbyImage image={image} alt="banner" />
      <Image fixed={data.cloudinaryAsset.fixed} alt="banner" />
    </>
  );
};

export default SingleImage;
