import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

const FluidTransformed = () => {
  const query = `
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          fluid(
            transformations: [
              "e_grayscale",
              "e_tint:100:blue:0p:white:100p"
            ]
          ) {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          fluid(
            transformations: ["e_grayscale", "e_tint:100:blue:0p:white:100p"]
          ) {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `);

  return (
    <div className="image-example">
      <h2>Apply Cloudinary transformations</h2>
      <Image
        fluid={data.image.cloudinary.fluid}
        alt="Marisa Morby standing in a rose garden."
      />
      <pre>{query}</pre>
    </div>
  );
};

export default FluidTransformed;
