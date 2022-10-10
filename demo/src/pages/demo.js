import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const SingleImage = () => {
  const data = useStaticQuery(graphql`
    query ExampleQuery {
      cloudinaryAsset(publicId: { eq: "gatsby-cloudinary/jason" }) {
        gatsbyImageData(width: 300, layout: FIXED)
      }
    }
  `);

  const image = getImage(data.cloudinaryAsset);

  return (
    <>
      <GatsbyImage image={image} alt="banner" />
    </>
  );
};

export default SingleImage;
