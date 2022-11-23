import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const GifTransformed = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "giphyCat" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            transformations: ["e_gamma:500"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "giphyCat" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            transformations: ["e_gamma:500"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>GIFs with transformations!</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Cat Pirate GIF By Product Hunt."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default GifTransformed;
