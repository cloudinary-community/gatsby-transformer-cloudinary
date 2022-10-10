import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const RemoteImage1 = () => {
  const data = useStaticQuery(graphql`
    query {
      remoteExample(name: { eq: "Remote Example 1" }) {
        cloudinary: remoteImage {
          gatsbyImageData(
            layout: FIXED
            height: 600
            placeholder: TRACED_SVG
            chained: ["t_lwj"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      remoteExample(name: {eq: "Remote Example 1"}) {
        cloudinary: remoteImage {
          gatsbyImageData(
            layout: FIXED
            height: 600
            placeholder: TRACED_SVG
            chained: ["t_lwj"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Example 1</h2>

      <GatsbyImage
        image={data.remoteExample.cloudinary.gatsbyImageData}
        alt="Jason, victorious."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage1;
