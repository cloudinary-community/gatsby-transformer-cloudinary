import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Article = ({ data }) => {
  const { article } = data;
  const gatsbyImage = getImage(article.feature.image);
  return (
    <article>
      <h1>{article.title}</h1>
      <GatsbyImage image={gatsbyImage} aria-hidden="true" alt="Hero Image" />
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query ArticleById($id: String!) {
    article(id: { eq: $id }) {
      title
      feature {
        image {
          gatsbyImageData(
            height: 300
            aspectRatio: 2
            placeholder: TRACED_SVG
            transformations: ["c_fill", "e_grayscale", "q_auto"]
          )
        }
      }
    }
  }
`;

export default Article;
