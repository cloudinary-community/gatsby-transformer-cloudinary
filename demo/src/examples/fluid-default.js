import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const FluidDefault = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Fluid images loaded from Cloudinary</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Marisa Morby standing in a rose garden."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FluidDefault;
