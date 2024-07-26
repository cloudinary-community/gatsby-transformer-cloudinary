exports.CloudinaryAssetType = `
  type CloudinaryAsset implements Node {
    id: ID!
    publicId: String! @deprecated(reason: "Use \`public_id\` instead")
    cloudName: String!
    version: String
    originalWidth: Int
    originalHeight: Int
    originalFormat: String
  }
`;
