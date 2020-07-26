const { createImageNode } = require('./create-image-node');

jest.mock('../options');
const { getPluginOptions } = require('../options');

describe('createImageNode', () => {
  function getDefaultArgs(args) {
    return {
      cloudinaryUploadResult: {},
      parentNode: {},
      createContentDigest: jest.fn(),
      createNodeId: jest.fn(),
      ...args,
    };
  }

  function getDefaultOptions(options) {
    return {
      ...options,
    };
  }

  test('calculates breakpoints when they are not provided', async () => {
    const options = getDefaultOptions({
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 1280,
    });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({ cloudinaryUploadResult: { width: 1920 } });
    delete args.cloudinaryUploadResult.responsive_breakpoints;
    const actual = createImageNode(args);

    const expected = { breakpoints: [1280, 1084, 888, 692, 496, 300] };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('calculates breakpoints when they are not provided and the image is small', async () => {
    const options = getDefaultOptions({
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 10000,
    });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({ cloudinaryUploadResult: { width: 1920 } });
    delete args.cloudinaryUploadResult.responsive_breakpoints;
    const actual = createImageNode(args);

    const expected = { breakpoints: [1920, 1596, 1272, 948, 624, 300] };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('calculates breakpoints when they are not provided and the image is really small', async () => {
    const options = getDefaultOptions({
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 10000,
    });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({ cloudinaryUploadResult: { width: 200 } });
    delete args.cloudinaryUploadResult.responsive_breakpoints;
    const actual = createImageNode(args);

    const expected = { breakpoints: [200] };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('uses breakpoints when they are provided', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      cloudinaryUploadResult: {
        responsive_breakpoints: [
          { breakpoints: [{ width: 300 }, { width: 200 }, { width: 100 }] },
        ],
      },
    });
    const actual = createImageNode(args);

    const expected = { breakpoints: [300, 200, 100] };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the cloud name', async () => {
    const options = getDefaultOptions({ cloudName: 'cloudName' });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs();
    const actual = createImageNode(args);

    const expected = { cloudName: 'cloudName' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the public ID', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      cloudinaryUploadResult: { public_id: 'public_id' },
    });
    const actual = createImageNode(args);

    const expected = { public_id: 'public_id' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the version', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      cloudinaryUploadResult: { version: 'version' },
    });
    const actual = createImageNode(args);

    const expected = { version: 'version' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the original height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      cloudinaryUploadResult: { height: 'originalHeight' },
    });
    const actual = createImageNode(args);

    const expected = { originalHeight: 'originalHeight' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the original width', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      cloudinaryUploadResult: { width: 'originalWidth' },
    });
    const actual = createImageNode(args);

    const expected = { originalWidth: 'originalWidth' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('creates a node ID', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const createNodeId = jest.fn(createNodeIdArg => {
      expect(createNodeIdArg).toEqual(
        'CloudinaryAsset-{"breakpoints":[20,35],"cloudName":"cloudName","height":100,"public_id":"public_id","version":7,"width":200}',
      );
      return 'createNodeIdResult';
    });
    const args = getDefaultArgs({
      createNodeId,
      cloudinaryUploadResult: {
        height: 100,
        public_id: 'public_id',
        responsive_breakpoints: [
          { breakpoints: [{ width: 20 }, { width: 35 }] },
        ],
        version: 7,
        width: 200,
      },
      cloudName: 'cloudName',
    });
    const actual = createImageNode(args);

    const expected = { id: 'createNodeIdResult' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('sets the parent', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs({
      parentNode: { id: 'parentNodeId' },
    });
    const actual = createImageNode(args);

    const expected = { parent: 'parentNodeId' };
    expect(actual).toEqual(expect.objectContaining(expected));
  });

  test('creates the content digest', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const createContentDigest = jest.fn(createContentDigestArg => {
      expect(createContentDigestArg).toEqual(
        '{"breakpoints":[20,35],"cloudName":"cloudName","height":100,"public_id":"public_id","version":7,"width":200}',
      );
      return 'createContentDigestResult';
    });
    const args = getDefaultArgs({
      createContentDigest,
      cloudinaryUploadResult: {
        height: 100,
        public_id: 'public_id',
        responsive_breakpoints: [
          { breakpoints: [{ width: 20 }, { width: 35 }] },
        ],
        version: 7,
        width: 200,
      },
      cloudName: 'cloudName',
    });
    const actual = createImageNode(args);

    const expected = {
      internal: {
        type: 'CloudinaryAsset',
        contentDigest: 'createContentDigestResult',
      },
    };
    expect(actual).toEqual(expect.objectContaining(expected));
  });
});
