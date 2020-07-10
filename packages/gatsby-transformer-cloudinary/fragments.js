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

export const cloudinaryAssetFluidLimitPresentationSize = graphql`
  fragment CloudinaryAssetFluidLimitPresentationSize on CloudinaryAssetFluid {
    maxHeight: presentationHeight
    maxWidth: presentationWidth
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
