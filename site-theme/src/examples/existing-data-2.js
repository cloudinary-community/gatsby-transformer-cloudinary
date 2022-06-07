import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

const ExistingData2 = () => {
  const data = useStaticQuery(graphql`
    query {
      existingData(name: { eq: "Existing data 2" }) {
        cloudinary: exampleImage {
          fixed(height: 300, width: 300, transformations: ["c_fill"]) {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      existingData(name: { eq: "Existing data 2" }) {
        cloudinary: exampleImage {
          fixed(height: 300, width: 300, transformations: ["c_fill"]) {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const nodeData = JSON.stringify(
    {
      exampleImage: {
        cloudinaryAssetData: true,
        cloudName: 'jlengstorf',
        publicId: 'gatsby-cloudinary/jason',
        originalHeight: 3024,
        originalWidth: 4032,
      },
    },
    null,
    2
  );

  return (
    <div className="image-example">
      <h2>Example 2</h2>
      <Image
        fixed={data.existingData.cloudinary.fixed}
        alt="Jason giving finger guns toward the camera."
      />
      <h3>Query</h3>
      <pre>{query}</pre>
      <h3>Data</h3>
      <pre>{nodeData}</pre>
    </div>
  );
};

export default ExistingData2;
