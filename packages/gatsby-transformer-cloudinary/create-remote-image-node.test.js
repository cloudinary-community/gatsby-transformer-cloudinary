const { createRemoteImageNode } = require('./create-remote-image-node');

jest.mock('./upload', () => {
  return {
    uploadImageToCloudinary: jest.fn(() => {
      const cloudinaryUploadResult = {
        version: 123456789,
        public_id: 'public_id',
        height: 1080,
        width: 1920,
        responsive_breakpoints: [
          { breakpoints: [{ width: 1920 }, { width: 960 }, { width: 480 }] },
        ],
      };
      return cloudinaryUploadResult;
    }),
  };
});

jest.mock('./options', () => {
  return {
    getPluginOptions: jest.fn(() => {
      return {
        cloudName: 'cloudName',
      };
    }),
  };
});

function getDefaultArgs(args) {
  return {
    url: 'https://www.google.com/images/puppy.jpg#anchor?abc=def',
    relationshipName: 'coverPhoto',
    createNode: jest.fn(() => 'createNode'),
    createNodeId: jest.fn(() => 'createNodeId'),
    createContentDigest: jest.fn(() => 'createContentDigest'),
    parentNode: { id: 'abc-123' },
    ...args,
  };
}

test('requires relationshipName', async () => {
  const args = getDefaultArgs();
  delete args.relationshipName;

  await expect(createRemoteImageNode(args)).rejects.toThrow(
    "'relationshipName' is a required argument.",
  );
});

test('creates an imageNode object', async () => {
  const args = getDefaultArgs();

  expect(await createRemoteImageNode(args)).toMatchSnapshot();
});

test("creates an imageNode in Gatsby's GraphQL layer", async () => {
  const createNode = jest.fn();
  const args = getDefaultArgs({ createNode });

  await createRemoteImageNode(args);
  expect(createNode).toHaveBeenCalledWith(
    {
      breakpoints: [1920, 960, 480],
      cloudName: 'cloudName',
      id: 'createNodeId',
      internal: {
        contentDigest: 'createContentDigest',
        type: 'CloudinaryAsset',
      },
      originalHeight: 1080,
      originalWidth: 1920,
      parent: 'abc-123',
      public_id: 'public_id',
      version: 123456789,
    },
    { name: 'gatsby-transformer-cloudinary' },
  );
});

test('links the newly created node to the provided parent node in GraphQL', async () => {
  const parentNode = {};
  const imageNodeId = 'image-node-id';
  const createNodeId = jest.fn(() => imageNodeId);
  const relationshipName = 'customRelationship';
  const args = getDefaultArgs({ parentNode, createNodeId, relationshipName });
  await createRemoteImageNode(args);

  expect(parentNode[`${relationshipName}___NODE`]).toEqual(imageNodeId);
});

test('overwrite', async () => {
  expect(0).toEqual(1);
});
