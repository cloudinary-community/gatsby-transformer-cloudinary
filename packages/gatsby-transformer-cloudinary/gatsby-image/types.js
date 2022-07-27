exports.CloudinaryAssetFixedType = `
    type CloudinaryAssetFixed {
      aspectRatio: Float
      base64: String
      height: Float
      src: String
      srcSet: String
      tracedSVG: String
      width: Float
    }
  `;

exports.CloudinaryAssetFluidType = `
    type CloudinaryAssetFluid {
      aspectRatio: Float!
      base64: String
      presentationHeight: Float
      presentationWidth: Float
      sizes: String!
      src: String!
      srcSet: String!
      tracedSVG: String
    }
  `;
