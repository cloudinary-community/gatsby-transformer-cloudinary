import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const EmptyDataPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allEmptyData {
        nodes {
          name
          expected
          cloudinary {
            gatsbyImageData(width: 200, backgroundColor: "#BADA55")
          }
        }
      }
    }
  `);

  return data.allEmptyData.nodes.map((node, index) => {
    const gatsbyImage = getImage(node.cloudinary);
    const expectNoImage = node.expected === 'No image' && !gatsbyImage;
    const expectImage = node.expected === 'An image' && gatsbyImage;
    const correct = expectNoImage || expectImage;

    return (
      <>
        <h2>
          {correct ? '✅' : '❌'}
          {' ' + node.name}
        </h2>
        <div>
          <strong>Expected:</strong> {node.expected}
        </div>
        {gatsbyImage ? (
          <GatsbyImage key={index} image={gatsbyImage} alt={node.name} />
        ) : (
          <div>No image for node with name: {node.name}</div>
        )}
      </>
    );
  });
};

export default EmptyDataPage;
