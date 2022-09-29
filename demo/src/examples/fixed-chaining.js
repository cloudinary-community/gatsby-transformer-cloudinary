import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const FixedChaining = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "jason" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            width: 300
            layout: FIXED
            placeholder: BLURRED
            transformations: ["e_grayscale"]
            chained: ["t_lwj"]
          )
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
            placeholder: BLURRED
            transformations: ["e_grayscale"]
            chained: ["t_lwj"]
          )
        }
      }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>For complex effects, use chaining</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Jason giving finger guns toward the camera."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FixedChaining;
