import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const FixedThumb = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "sergey-semin-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 225
            aspectRatio: 1
            layout: FIXED
            transformations: ["c_thumb", "g_face"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "sergey-semin-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 225
            aspectRatio: 1
            layout: FIXED
            transformations: ["c_thumb", "g_face"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Create avatars from any image!</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Pirate photo by Sergey Semin from unsplash."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FixedThumb;
