import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Project = ({ data }) => {
  const { project } = data;
  const gatsbyImage = getImage(project.coverImage);
  return (
    <article>
      <h1>{project.name}</h1>
      <GatsbyImage image={gatsbyImage} aria-hidden="true" alt="Cover Image" />
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query ProjectById($id: String!) {
    project(id: { eq: $id }) {
      name
      coverImage {
        gatsbyImageData(
          height: 300
          aspectRatio: 2
          placeholder: TRACED_SVG
          transformations: ["c_fill", "g_auto:subject", "q_auto"]
        )
      }
    }
  }
`;

export default Project;
