import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { GatsbyImage } from 'gatsby-plugin-image';

const ExistingData1 = () => {
  const data = useStaticQuery(graphql`
    query {
      existingData(name: { eq: "Existing data 1" }) {
        nested {
          cloudinary: exampleImage {
            gatsbyImageData(
              width: 300
              height: 300
              layout: FIXED
              transformations: ["c_fill"]
              placeholder: TRACED_SVG
            )
            fixed(height: 300, width: 300, transformations: ["c_fill"]) {
              ...CloudinaryAssetFixed
            }
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      existingData(name: { eq: "Existing data 1" }) {
        nested {
          cloudinary: exampleImage {
            gatsbyImageData(
              width: 300
              height: 300
              layout: FIXED
              transformations: ["c_fill"]
              placeholder: TRACED_SVG
            )
            fixed(height: 300, width: 300, transformations: ["c_fill"]) {
              ...CloudinaryAssetFixed
            }
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const nodeData = JSON.stringify(
    {
      nested: {
        exampleImage: {
          cloudinaryAssetData: true,
          cloudName: 'lilly-labs-consulting',
          publicId: 'sample',
        },
      },
    },
    null,
    2
  );

  return (
    <div className="image-example">
      <h2>Example 1</h2>
      <h3>gatsby-plugin-image</h3>
      <GatsbyImage
        image={data.existingData.nested.cloudinary.gatsbyImageData}
        alt="sample image"
      />
      <h3>gatsby-image</h3>
      <Image
        fixed={data.existingData.nested.cloudinary.fixed}
        alt="sample image"
      />
      <h3>Query</h3>
      <pre>{query}</pre>
      <h3>Data</h3>
      <pre>{nodeData}</pre>
    </div>
  );
};

export default ExistingData1;
