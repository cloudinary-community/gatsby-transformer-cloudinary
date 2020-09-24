const { createAssetNodesFromData } = require('./create-asset-nodes-from-data');

jest.mock('../create-image-node');
const { createImageNode } = require('../create-image-node');

describe('createAssetNodesFromData', () => {
  beforeEach(() => {
    createImageNode.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function getDefaultArgs(args) {
    return {
      node: {
        authorPhoto: {
          cloudinaryAssetData: true,
          cloudName: 'cloudName',
          publicId: 'publicId',
          originalHeight: 1080,
          originalWidth: 1920,
        },
      },
      actions: { createNode: jest.fn() },
      createNodeId: jest.fn(),
      createContentDigest: jest.fn(),
      ...args,
    };
  }

  test('passes the right data to createImageNode', () => {
    const args = getDefaultArgs();
    const assetData = { ...args.node.authorPhoto };
    createAssetNodesFromData(args);
    expect(createImageNode).toHaveBeenCalledWith(
      expect.objectContaining({
        cloudinaryUploadResult: {
          height: assetData.originalHeight,
          width: assetData.originalWidth,
          public_id: assetData.publicId,
        },
        cloudName: assetData.cloudName,
        createContentDigest: args.createContentDigest,
        createNodeId: args.createNodeId,
        parentNode: args.node,
      }),
    );
  });

  test('passes the result of createImageNode to createNode', () => {
    const createImageNodeResult = 'create-image-node-result';
    createImageNode.mockReturnValue(createImageNodeResult);

    const args = getDefaultArgs();
    createAssetNodesFromData(args);
    expect(args.actions.createNode).toHaveBeenCalledWith(
      createImageNodeResult,
      { name: 'gatsby-transformer-cloudinary' },
    );
  });

  test('adds a relationship to the parent node', () => {
    const createImageNodeResult = { id: 'created-image-node-id' };
    createImageNode.mockReturnValue(createImageNodeResult);

    const args = getDefaultArgs();
    createAssetNodesFromData(args);
    expect(args.node).toEqual({ authorPhoto___NODE: createImageNodeResult.id });
  });

  test('does not call createImageNode if cloudinaryAssetData !== true', () => {
    const args = getDefaultArgs();
    args.node.authorPhoto.cloudinaryAssetData = 'true';
    createAssetNodesFromData(args);
    expect(createImageNode).not.toHaveBeenCalled();
  });

  test('does not call createImageNode if cloudName is missing', () => {
    const args = getDefaultArgs();
    args.node.authorPhoto.cloudName = null;
    createAssetNodesFromData(args);
    expect(createImageNode).not.toHaveBeenCalled();
  });

  test('does not call createImageNode if publicId is missing', () => {
    const args = getDefaultArgs();
    args.node.authorPhoto.publicId = null;
    createAssetNodesFromData(args);
    expect(createImageNode).not.toHaveBeenCalled();
  });

  test('does not call createImageNode if originalHeight is missing', () => {
    const args = getDefaultArgs();
    args.node.authorPhoto.originalHeight = null;
    createAssetNodesFromData(args);
    expect(createImageNode).not.toHaveBeenCalled();
  });

  test('does not call createImageNode if originalWidth is missing', () => {
    const args = getDefaultArgs();
    args.node.authorPhoto.originalWidth = null;
    createAssetNodesFromData(args);
    expect(createImageNode).not.toHaveBeenCalled();
  });

  test('deletes nodes with .cloudinaryAssetData === true', () => {
    const args = getDefaultArgs({
      node: { authorPhoto: { cloudinaryAssetData: true } },
    });
    expect(args.node.authorPhoto).toBeDefined();
    createAssetNodesFromData(args);
    expect(args.node.authorPhoto).toBeUndefined();
  });
});
