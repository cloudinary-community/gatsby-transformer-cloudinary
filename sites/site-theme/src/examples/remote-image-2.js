import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

const RemoteImage2 = () => {
  const data = useStaticQuery(graphql`
    query {
      remoteExample(name: { eq: "Remote Example 2" }) {
        cloudinary: remoteImage {
          fluid(
            maxWidth: 300
            transformations: ["ar_1", "c_fill", "e_pixelate_faces"]
          ) {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      remoteExample(name: {eq: "Remote Example 2"}) {
        cloudinary: remoteImage {
          fluid(
            maxWidth: 300
            transformations: ["ar_1", "c_fill", "e_pixelate_faces"]
          ) {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Example 2</h2>
      <Image fluid={data.remoteExample.cloudinary.fluid} alt="Remote image" />
      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage2;
