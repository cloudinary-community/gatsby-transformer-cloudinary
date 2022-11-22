import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const UploadedChaining = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "sergey-semin-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            height: 300
            layout: FIXED
            transformations: ["t_gatsby-demo"]
            chained: [
              "co_rgb:FFFF00,l_text:Times_90_bold:Cool%2520text"
              "fl_layer_apply,g_south,y_20"
            ]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "sergey-semin-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            height: 300
            layout: FIXED
            transformations: ["t_gatsby-demo"]
            chained: [
              "co_rgb:FFFF00,l_text:Times_90_bold:Cool%2520text"
              "fl_layer_apply,g_south,y_20"
            ]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>For complex effects, use chaining</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Pirate photo by Sergey Semin from Unsplash."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default UploadedChaining;
