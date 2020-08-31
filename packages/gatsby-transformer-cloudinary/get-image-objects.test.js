const {
  getFluidImageObject,
  getFixedImageObject,
} = require('./get-image-objects');

jest.mock('axios');
const { get } = require('axios');
const base64ImageData = ['1', '2', '3'];
get.mockReturnValue({ data: base64ImageData });

jest.mock('./options');
const { getPluginOptions } = require('./options');

describe('getFluidImageObject', () => {
  function getDefaultArgs(args) {
    return {
      public_id: 'public_id',
      cloudName: 'cloudName',
      originalWidth: 1920,
      originalHeight: 1080,
      ...args,
    };
  }

  function getDefaultOptions(options) {
    return {
      fluidMaxWidth: 1000,
      ...options,
    };
  }

  it('returns presentationWidth=fluidMaxWidth when fluidMaxWidth is smaller', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const presentationWidth = options.fluidMaxWidth;
    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ presentationWidth }),
    );
  });

  it('returns presentationWidth=originalWidth when originalWidth is smaller', async () => {
    const options = getDefaultOptions({ fluidMaxWidth: 10000 });
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const presentationWidth = args.originalWidth;
    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ presentationWidth }),
    );
  });

  it('calculates presentation height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const presentationHeight = Math.round(
      (options.fluidMaxWidth * args.originalHeight) / args.originalWidth,
    );
    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ presentationHeight }),
    );
  });

  it('returns a base64 image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const base64 = Buffer.from(base64ImageData).toString('base64');
    const expectedBase64Image = `data:image/jpeg;base64,${base64}`;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: expectedBase64Image }),
    );
  });

  it('does not fetch base64 images multiple times', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    for (let i = 1; i <= 3; i++) {
      await getFluidImageObject(args);
    }
    expect(get).toHaveBeenCalledTimes(1);
  });
});

describe('getFixedImageObject', () => {
  function getDefaultArgs(args) {
    return {
      public_id: 'public_id',
      cloudName: 'cloudName',
      originalWidth: 1920,
      originalHeight: 1080,
      ...args,
    };
  }

  function getDefaultOptions(options) {
    return {
      ...options,
    };
  }

  it('calculates the height based on the provided width', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 100, height: 56 }),
    );
  });

  it('calculates the width based on the provided height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ height: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 178, height: 100 }),
    );
  });

  it('creates a srcset with multiple images based on the provided width', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 160 });

    const expectedSrcSet = [
      'https://res.cloudinary.com/cloudName/image/upload/w_160,f_auto,q_auto/public_id 1x',
      'https://res.cloudinary.com/cloudName/image/upload/w_240,f_auto,q_auto/public_id 1.5x',
      'https://res.cloudinary.com/cloudName/image/upload/w_320,f_auto,q_auto/public_id 2x',
      'https://res.cloudinary.com/cloudName/image/upload/w_480,f_auto,q_auto/public_id 3x',
    ];
    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({
        srcSet: expectedSrcSet.join(','),
      }),
    );
  });

  it('creates a srcset with multiple images based on the provided height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ height: 100 });

    const expectedSrcSet = [
      'https://res.cloudinary.com/cloudName/image/upload/w_178,f_auto,q_auto/public_id 1x',
      'https://res.cloudinary.com/cloudName/image/upload/w_267,f_auto,q_auto/public_id 1.5x',
      'https://res.cloudinary.com/cloudName/image/upload/w_356,f_auto,q_auto/public_id 2x',
      'https://res.cloudinary.com/cloudName/image/upload/w_533,f_auto,q_auto/public_id 3x',
    ];
    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({
        srcSet: expectedSrcSet.join(','),
      }),
    );
  });

  it('returns a base64 image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const base64 = Buffer.from(base64ImageData).toString('base64');
    const expectedBase64Image = `data:image/jpeg;base64,${base64}`;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: expectedBase64Image }),
    );
  });

  it('does not fetch base64 images multiple times', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    for (let i = 1; i <= 3; i++) {
      await getFluidImageObject(args);
    }
    expect(get).toHaveBeenCalledTimes(1);
  });
});
