import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const RemoteImage2 = () => {
  const data = useStaticQuery(graphql`
    query {
      remoteExample(name: { eq: "Remote Example 2" }) {
        cloudinary: remoteImage {
          gatsbyImageData(
            layout: CONSTRAINED
            width: 600
            aspectRatio: 1
            placeholder: BLURRED
            transformations: ["c_fill", "e_pixelate_faces"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      remoteExample(name: {eq: "Remote Example 2"}) {
        cloudinary: remoteImage {
           gatsbyImageData(
            layout: CONSTRAINED
            width: 600
            aspectRatio: 1
            placeholder: BLURRED
            transformations: ["c_fill", "e_pixelate_faces"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Example 2</h2>

      <GatsbyImage
        image={data.remoteExample.cloudinary.gatsbyImageData}
        alt="Jason, victorious."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage2;
