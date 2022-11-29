import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const LocalUploadExample = () => {
  const data = useStaticQuery(graphql`
    query {
      file(name: { eq: "sergey-semin-unsplash" }) {
        childCloudinaryAsset {
          gatsbyImageData(height: 300, layout: FIXED)
        }
      }
    }
  `);

  const gatsbyImage = getImage(data.file.childCloudinaryAsset);

  return (
    <GatsbyImage
      image={gatsbyImage}
      alt="Pirate photo by Sergey Semin from Unsplash."
    />
  );
};

export default LocalUploadExample;
