import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export default () => {
  const query = `
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          fluid(transformations: ["e_pixelate_faces"]) {
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
          fluid(transformations: ["e_pixelate_faces"]) {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `);

  return (
    <div className="image-example">
      <h2>You can pixelate faces!</h2>
      <Image
        fluid={data.image.cloudinary.fluid}
        alt="Marisa Morby standing in a rose garden."
      />
      <pre>{query}</pre>
    </div>
  );
};
