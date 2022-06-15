exports.CloudinaryAssetType = `
  type CloudinaryAsset implements Node @dontInfer  {
    publicId: String!
    cloudName: String!
    version: String
  }
`;
