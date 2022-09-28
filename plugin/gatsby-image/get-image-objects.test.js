const {
  getFluidImageObject,
  getFixedImageObject,
} = require('./get-image-objects');

jest.mock('axios');
const { get } = require('axios');
const base64ImageData = ['1', '2', '3'];
get.mockReturnValue({ data: base64ImageData });

jest.mock('../options');
const { getPluginOptions } = require('../options');

describe('getFluidImageObject', () => {
  function getDefaultArgs(args) {
    return {
      public_id: 'public_id',
      cloudName: 'cloudName',
      originalWidth: 1920,
      originalHeight: 1080,
      fieldsToSelect: ['base64'],
      defaultTracedSVG: 'defaultTracedSVG',
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
      expect.objectContaining({ presentationWidth })
    );
  });

  it('returns presentationWidth=originalWidth when originalWidth is smaller', async () => {
    const options = getDefaultOptions({ fluidMaxWidth: 10000 });
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const presentationWidth = args.originalWidth;
    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ presentationWidth })
    );
  });

  it('calculates presentation height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const presentationHeight = Math.round(
      (options.fluidMaxWidth * args.originalHeight) / args.originalWidth
    );
    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ presentationHeight })
    );
  });

  it('returns a base64 image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const base64 = Buffer.from(base64ImageData).toString('base64');
    const expectedBase64Image = `data:image/jpeg;base64,${base64}`;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: expectedBase64Image })
    );
  });

  it('does not return base64 if base64 is not a field to select', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ fieldsToSelect: [] });

    expect((await getFluidImageObject(args)).base64).toEqual(undefined);
  });

  it('returns a tracedSVG image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const expectedTracedSVG = args.defaultTracedSVG;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ tracedSVG: expectedTracedSVG })
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
      fieldsToSelect: ['base64'],
      defaultTracedSVG: 'defaultTracedSVG',
      ...args,
    };
  }

  function getDefaultOptions(options) {
    return {
      ...options,
    };
  }

  it('uses a width of 400 px if no width is provided', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 400 })
    );
  });

  it("uses the image's originalWidth if it is smaller than the requested width", async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 20000 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 1920 })
    );
  });

  it("uses the image's originalWidth if it is smaller than the default width of 400 px", async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ originalWidth: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 100 })
    );
  });

  it('calculates the height based on the provided width', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 100, height: 56 })
    );
  });

  it('calculates the width based on the provided height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ height: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 178, height: 100 })
    );
  });

  it('allows the user to set the width and height simultaneously', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 100, height: 100 });

    expect(await getFixedImageObject(args)).toEqual(
      expect.objectContaining({ width: 100, height: 100 })
    );
  });

  it('creates a srcset with multiple images based on the provided width', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 160 });

    const expectedSrcSet = [
      'https://res.cloudinary.com/cloudName/image/upload/w_160/public_id 1x',
      'https://res.cloudinary.com/cloudName/image/upload/w_240/public_id 1.5x',
      'https://res.cloudinary.com/cloudName/image/upload/w_320/public_id 2x',
      'https://res.cloudinary.com/cloudName/image/upload/w_480/public_id 3x',
    ];
    expect((await getFixedImageObject(args)).srcSet).toEqual(
      expectedSrcSet.join(',')
    );
  });

  it('creates a srcset with multiple images based on the provided height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ height: 97 });

    const expectedSrcSet = [
      'https://res.cloudinary.com/cloudName/image/upload/h_97/public_id 1x',
      'https://res.cloudinary.com/cloudName/image/upload/h_146/public_id 1.5x',
      'https://res.cloudinary.com/cloudName/image/upload/h_194/public_id 2x',
      'https://res.cloudinary.com/cloudName/image/upload/h_291/public_id 3x',
    ];
    expect((await getFixedImageObject(args)).srcSet).toEqual(
      expectedSrcSet.join(',')
    );
  });

  it('creates a srcset with multiple images based on the provided width and height', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ width: 89, height: 97 });

    const expectedSrcSet = [
      'https://res.cloudinary.com/cloudName/image/upload/w_89,h_97/public_id 1x',
      'https://res.cloudinary.com/cloudName/image/upload/w_134,h_146/public_id 1.5x',
      'https://res.cloudinary.com/cloudName/image/upload/w_178,h_194/public_id 2x',
      'https://res.cloudinary.com/cloudName/image/upload/w_267,h_291/public_id 3x',
    ];
    expect((await getFixedImageObject(args)).srcSet).toEqual(
      expectedSrcSet.join(',')
    );
  });

  it('returns a base64 image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const base64 = Buffer.from(base64ImageData).toString('base64');
    const expectedBase64Image = `data:image/jpeg;base64,${base64}`;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: expectedBase64Image })
    );
  });

  it('does not return base64 if base64 is not a field to select', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs({ fieldsToSelect: [] });

    expect((await getFluidImageObject(args)).base64).toEqual(undefined);
  });

  it('returns a tracedSVG image', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);
    const args = getDefaultArgs();

    const expectedTracedSVG = args.defaultTracedSVG;

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ tracedSVG: expectedTracedSVG })
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

  it('uses defaultBase64 images when provided', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const defaultBase64 = 'defaultBase64';
    const args = getDefaultArgs({ defaultBase64 });

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: defaultBase64 })
    );
  });

  it('ignores defaultBase64 images when ignoreDefaultBase64 is true', async () => {
    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const defaultBase64 = 'defaultBase64';
    const args = getDefaultArgs({ defaultBase64, ignoreDefaultBase64: true });

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: 'data:image/jpeg;base64,AQID' })
    );
  });

  it('uses defaultBase64 images when ignoreDefaultBase64 is true and alwaysUseDefaultBase64 is true', async () => {
    const options = getDefaultOptions({ alwaysUseDefaultBase64: true });
    getPluginOptions.mockReturnValue(options);

    const defaultBase64 = 'defaultBase64';
    const args = getDefaultArgs({ defaultBase64, ignoreDefaultBase64: true });

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: defaultBase64 })
    );
  });

  it('uses defaultBase64 images when ignoreDefaultBase64 is false and alwaysUseDefaultBase64 is true', async () => {
    const options = getDefaultOptions({ alwaysUseDefaultBase64: true });
    getPluginOptions.mockReturnValue(options);

    const defaultBase64 = 'defaultBase64';
    const args = getDefaultArgs({ defaultBase64, ignoreDefaultBase64: true });

    expect(await getFluidImageObject(args)).toEqual(
      expect.objectContaining({ base64: defaultBase64 })
    );
  });
});
