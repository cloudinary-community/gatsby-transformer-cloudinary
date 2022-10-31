import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const FluidTransformed = () => {
  const query = `
    query {
      image: file(name: { eq: "joppe-spaa-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(layout: CONSTRAINED, transformation: "e_grayscale,e_tint:100:blue:0p:white:100p")
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "joppe-spaa-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            transformations: ["e_grayscale", "e_tint:100:blue:0p:white:100p"]
          )
        }
      }
    }
  `);

  return (
    <div className="image-example">
      <h2>Apply Cloudinary transformations</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Pirate Cat photo by Joppe Spaa from unsplash."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FluidTransformed;
