import { graphql } from 'gatsby';

export const cloudinaryAssetFluid = graphql`
  fragment CloudinaryAssetFluid on CloudinaryAssetFluid {
    aspectRatio
    base64
    sizes
    src
    srcSet
  }
`;

export const cloudinaryAssetFluid_noBase64 = graphql`
  fragment CloudinaryAssetFluid_noBase64 on CloudinaryAssetFluid {
    aspectRatio
    sizes
    src
    srcSet
  }
`;

export const cloudinaryAssetFixed = graphql`
  fragment CloudinaryAssetFixed on CloudinaryAssetFixed {
    base64
    height
    src
    srcSet
    width
  }
`;

export const cloudinaryAssetFixed_noBase64 = graphql`
  fragment cloudinaryAssetFixed_noBase64 on CloudinaryAssetFixed {
    height
    src
    srcSet
    width
  }
`;
