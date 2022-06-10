import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

const RemoteImage1 = () => {
  const data = useStaticQuery(graphql`
    query {
      remoteExample(name: { eq: "Remote Example 1" }) {
        cloudinary: remoteImage {
          fixed(height: 600, chained: ["t_lwj"]) {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      remoteExample(name: {eq: "Remote Example 1"}) {
        cloudinary: remoteImage {
          fixed(height: 600, chained: ["t_lwj"]) {
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
      <h2>Example 1</h2>
      <Image fixed={data.remoteExample.cloudinary.fixed} alt="Remote image" />
      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage1;
