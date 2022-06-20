import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// Both gatsby-image and gatsby-plugin-image image is supported
// gatsby-image is deprecated, use gatsby-plugin-image for new projects
import Image from 'gatsby-image';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const SingleImage = () => {
  const data = useStaticQuery(graphql`
    query Avatar {
      file(name: { eq: "marisa" }) {
        childCloudinaryAsset {
          gatsbyImageData(layout: CONSTRAINED, backgroundColor: "HotPink")
          fluid {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `);

  const image = getImage(data.file.childCloudinaryAsset);

  return (
    <>
      <GatsbyImage image={image} alt="banner" />
      {/* <Image fluid={data.file.childCloudinaryAsset.fluid} alt="banner" /> */}
    </>
  );
};

export default SingleImage;
