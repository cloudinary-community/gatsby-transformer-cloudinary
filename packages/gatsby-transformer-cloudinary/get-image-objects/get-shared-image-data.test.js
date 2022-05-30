const { getImageURL } = require('./get-shared-image-data');

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
