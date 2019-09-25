import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export default () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "jason" }) {
        cloudinary: childCloudinaryAsset {
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
      <Image
        fixed={data.image.cloudinary.fixed}
        alt="Jason giving finger guns toward the camera."
      />
      <pre>{query}</pre>
    </div>
  );
};
