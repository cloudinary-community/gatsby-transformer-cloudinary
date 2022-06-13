import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { GatsbyImage } from 'gatsby-plugin-image';

const FluidPixelated = () => {
  const query = `
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(layout: CONSTRAINED, transformations: ["e_pixelate_faces"])
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
          gatsbyImageData(
            layout: CONSTRAINED
            transformations: ["e_pixelate_faces"]
          )
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

      <h3>gatsby-plugin-image</h3>
      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Marisa Morby standing in a rose garden."
      />

      <h3>gatsby-image</h3>
      <Image
        fluid={data.image.cloudinary.fluid}
        alt="Marisa Morby standing in a rose garden."
      />

      <h3>Query</h3>
      <pre>{query}</pre>

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FluidPixelated;
