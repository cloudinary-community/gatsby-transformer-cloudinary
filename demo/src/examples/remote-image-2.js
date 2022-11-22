import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const RemoteImage2 = () => {
  const data = useStaticQuery(graphql`
    query {
      remoteExample(name: { eq: "Remote Example 2" }) {
        remoteImage {
          gatsbyImageData(
            layout: CONSTRAINED
            height: 300
            aspectRatio: 0.8
            placeholder: BLURRED
            transformations: ["c_thumb"]
            chained: ["t_gatsby-demo"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      remoteExample(name: { eq: "Remote Example 2" }) {
        remoteImage {
          gatsbyImageData(
            layout: CONSTRAINED
            height: 300
            aspectRatio: 0.8
            placeholder: BLURRED
            transformations: ["c_thumb"]
            chained: ["t_gatsby-demo"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Remote image</h2>

      <GatsbyImage
        image={data.remoteExample.remoteImage.gatsbyImageData}
        alt="A display of a scull on top of books with a flower photo from from Unsplash"
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage2;
