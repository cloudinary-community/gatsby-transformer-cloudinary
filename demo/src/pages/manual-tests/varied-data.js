import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const ProblemExample = () => {
  const data = useStaticQuery(graphql`
    query {
      allVariedData {
        nodes {
          name
          expected
          gatsbyImageData(height: 200, backgroundColor: "#BADA55")
        }
      }
    }
  `);

  return data.allVariedData.nodes.map((node, index) => {
    const gatsbyImage = getImage(node);

    return (
      <>
        <h2>{node.name}</h2>
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

export default ProblemExample;
