import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { GatsbyImage } from 'gatsby-plugin-image';

const FixedThumb = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "jason" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 225
            aspectRatio: 1
            layout: FIXED
            crop: "thumb"
            gravity: "face"
          )
          fixed(width: 225, transformations: ["ar_1:1", "c_thumb", "g_face"]) {
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
            width: 225
            aspectRatio: 1
            layout: FIXED
            crop: "thumb"
            gravity: "face"
          )
          fixed(
            width: 225,
            transformations: ["ar_1:1", "c_thumb", "g_face"]
          ) {
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
      <h2>Create avatars from any image!</h2>

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

export default FixedThumb;
