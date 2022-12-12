import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const BlogPost = ({ data }) => {
  const { blogPost } = data;
  const gatsbyImage = getImage(blogPost.heroImage);
  return (
    <article>
      <h1>{blogPost.title}</h1>
      <GatsbyImage image={gatsbyImage} aria-hidden="true" alt="Hero Image" />
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query BlogPostById($id: String!) {
    blogPost(id: { eq: $id }) {
      title
      heroImage {
        gatsbyImageData(
          height: 300
          aspectRatio: 2
          placeholder: TRACED_SVG
          transformations: ["c_fill", "e_grayscale", "q_auto"]
        )
      }
    }
  }
`;

export default BlogPost;
