import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { GatsbyImage } from 'gatsby-plugin-image';

const FixedTransformed = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "jason" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 300
            layout: FIXED
            transformations: ["e_grayscale"]
          )
          fixed(width: 300, transformations: ["e_grayscale"]) {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "jason" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 300
            layout: FIXED
            transformations: ["e_grayscale"]
          )
          fixed(width: 300, transformations: ["e_grayscale"]) {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Add any transformations you like</h2>

      <h3>gatsby-plugin-image</h3>
      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Jason giving finger guns toward the camera."
      />

      <h3>gatsby-image</h3>
      <Image
        fixed={data.image.cloudinary.fixed}
        alt="Jason giving finger guns toward the camera."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FixedTransformed;
