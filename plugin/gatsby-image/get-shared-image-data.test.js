const { getImageURL, getBreakpoints } = require('./get-shared-image-data');

jest.mock('../options');
const { getPluginOptions } = require('../options');

describe('getImageURL', () => {
  function getDefaultArgs(args) {
    return {
      public_id: 'public_id',
      cloudName: 'cloudName',
      transformations: ['w_400', 'e_grayscale'],
      chained: ['c_crop', 'g_face'],
      version: '555',
      ...args,
    };
  }

  it('adds f_auto and q_auto when enableDefaultTransformations is true', () => {
    const args = getDefaultArgs();

    getPluginOptions.mockReturnValue({ enableDefaultTransformations: true });

    const actual = getImageURL(args);
    expect(actual).toEqual(
      'https://res.cloudinary.com/cloudName/image/upload/w_400,e_grayscale,f_auto,q_auto/c_crop/g_face/v555/public_id'
    );
  });

  it('does not add f_auto and q_auto when enableDefaultTransformations is false', () => {
    const args = getDefaultArgs();

    getPluginOptions.mockReturnValue({ enableDefaultTransformations: false });

    const actual = getImageURL(args);
    expect(actual).toEqual(
      'https://res.cloudinary.com/cloudName/image/upload/w_400,e_grayscale/c_crop/g_face/v555/public_id'
    );
  });
});

describe('getBreakpoints', () => {
  it('calculates breakpoints when they are not provided', async () => {
    const pluginOptions = {
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 1280,
    };

    const source = {
      originalWidth: 1920,
    };

    const expected = [1280, 1084, 888, 692, 496, 300];
    expect(getBreakpoints(source, pluginOptions)).toEqual(expected);
  });

  it('calculates breakpoints when they are not provided and the image is small', async () => {
    const pluginOptions = {
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 10000,
    };

    const source = {
      originalWidth: 1920,
    };

    const expected = [1920, 1596, 1272, 948, 624, 300];
    expect(getBreakpoints(source, pluginOptions)).toEqual(expected);
  });

  it('calculates breakpoints when they are not provided and the image is really small', async () => {
    const pluginOptions = {
      breakpointsMaxImages: 6,
      fluidMinWidth: 300,
      fluidMaxWidth: 10000,
    };

    const source = {
      originalWidth: 200,
    };

    const expected = [200];
    expect(getBreakpoints(source, pluginOptions)).toEqual(expected);
  });

  it('uses breakpoints when they are provided', async () => {
    const pluginOptions = {};

    const source = {
      originalWidth: 300,
      rawCloudinaryData: {
        responsive_breakpoints: [
          { breakpoints: [{ width: 300 }, { width: 200 }, { width: 100 }] },
        ],
      },
    };

    const expected = [300, 200, 100];
    expect(getBreakpoints(source, pluginOptions)).toEqual(expected);
  });
});
