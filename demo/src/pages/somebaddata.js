import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const ProblemExample = () => {
  const data = useStaticQuery(graphql`
    query {
      allSomeBadImageData {
        nodes {
          name
          gatsbyImageData(height: 200)
        }
      }
    }
  `);

  return data.allSomeBadImageData.nodes.map((node, index) => {
    const gatsbyImage = getImage(node);

    if (gatsbyImage) {
      return <GatsbyImage key={index} image={gatsbyImage} alt={node.name} />;
    } else {
      return <div>No image for node with name: {node.name}</div>;
    }
  });
};

export default ProblemExample;
