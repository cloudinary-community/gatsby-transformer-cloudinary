const { createRemoteImageNode } = require('./create-remote-image-node');

jest.mock('./create-image-node');
jest.mock('./options');
jest.mock('./upload');

const { createImageNode } = require('./create-image-node');
const { getPluginOptions } = require('./options');
const { uploadImageToCloudinary } = require('./upload');

function getDefaultArgs(args) {
  return {
    url: 'https://www.google.com/images/puppy.jpg#anchor?abc=def',
    relationshipName: 'coverPhoto',
    createNode: jest.fn(() => 'createNode'),
    createNodeId: jest.fn(() => 'createNodeId'),
    createContentDigest: jest.fn(() => 'createContentDigest'),
    parentNode: { id: 'abc-123' },
    overwriteExisting: false,
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

test('calls uploadImageToCloudinary with overwrite from plugin options by default', async () => {
  const args = getDefaultArgs();
  delete args.overwriteExisting;

  const optionOverwrite = 'optionOverwrite';
  getPluginOptions.mockReturnValue({ overwriteExisting: optionOverwrite });
  createImageNode.mockReturnValue({ id: 'image-node-id' });

  await createRemoteImageNode(args);

  const expectedArgs = { overwrite: optionOverwrite };
  expect(uploadImageToCloudinary).toHaveBeenCalledWith(
    expect.objectContaining(expectedArgs),
  );
});

test('calls uploadImageToCloudinary with overwrite from args if provided', async () => {
  const argsOverwrite = 'argsOverwrite';
  const args = getDefaultArgs({ overwriteExisting: argsOverwrite });

  const optionOverwrite = 'optionOverwrite';
  getPluginOptions.mockReturnValue({ overwriteExisting: optionOverwrite });
  createImageNode.mockReturnValue({ id: 'image-node-id' });

  await createRemoteImageNode(args);

  const expectedArgs = { overwrite: argsOverwrite };
  expect(uploadImageToCloudinary).toHaveBeenCalledWith(
    expect.objectContaining(expectedArgs),
  );
});

test('calls uploadImageToCloudinary with the correct arguments', async () => {
  expect(0).toEqual(1);
});

test('passes the correct arguments to createImageNode', async () => {
  const args = getDefaultArgs();
  createImageNode.mockReturnValue({ id: 'image-node-id' });
  const uploadImageToCloudinaryResult = 'uploadImageToCloudinaryResult';
  uploadImageToCloudinary.mockReturnValue(uploadImageToCloudinaryResult);

  await createRemoteImageNode(args);

  const expectedArgs = {
    relationshipName: args.relationshipName,
    cloudinaryUploadResult: uploadImageToCloudinaryResult,
    parentNode: args.parentNode,
    createContentDigest: args.createContentDigest,
    createNode: args.createNode,
    createNodeId: args.createNodeId,
  };
  expect(createImageNode).toHaveBeenCalledWith(
    expect.objectContaining(expectedArgs),
  );
});

test("creates an imageNode in Gatsby's GraphQL layer", async () => {
  const createNode = jest.fn();
  const args = getDefaultArgs({ createNode });
  const createImageNodeResult = 'createImageNodeResult';
  createImageNode.mockReturnValue(createImageNodeResult);

  await createRemoteImageNode(args);
  expect(createNode).toHaveBeenCalledWith(createImageNodeResult, {
    name: 'gatsby-transformer-cloudinary',
  });
});

test('links the newly created node to the provided parent node in GraphQL', async () => {
  const args = getDefaultArgs();
  const imageNodeId = 'image-node-id';
  createImageNode.mockReturnValue({ id: imageNodeId });
  await createRemoteImageNode(args);

  expect(args.parentNode[`${args.relationshipName}___NODE`]).toEqual(
    imageNodeId,
  );
});

test('returns the image node that it created', async () => {
  expect(0).toEqual(1);
});
