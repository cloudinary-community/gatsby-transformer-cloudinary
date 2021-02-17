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

export const cloudinaryAssetFluidNoBase64 = graphql`
  fragment CloudinaryAssetFluid_noBase64 on CloudinaryAssetFluid {
    aspectRatio
    sizes
    src
    srcSet
  }
`;

export const cloudinaryAssetFluidTracedSVG = graphql`
  fragment CloudinaryAssetFluid_tracedSVG on CloudinaryAssetFluid {
    aspectRatio
    sizes
    src
    srcSet
    tracedSVG
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

export const cloudinaryAssetFixedNoBase64 = graphql`
  fragment CloudinaryAssetFixed_noBase64 on CloudinaryAssetFixed {
    height
    src
    srcSet
    width
  }
`;

export const cloudinaryAssetFixedTracedSVG = graphql`
  fragment CloudinaryAssetFixed_tracedSVG on CloudinaryAssetFixed {
    height
    src
    srcSet
    tracedSVG
    width
  }
`;
