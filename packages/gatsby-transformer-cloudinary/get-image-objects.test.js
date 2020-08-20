const { getFluidImageObject } = require('./get-image-objects');

jest.mock('axios');
const { get } = require('axios');
const base64ImageData = ['1', '2', '3'];
get.mockReturnValue({ data: base64ImageData });

jest.mock('./options');
const { getPluginOptions } = require('./options');

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

describe('getFluidImageObject', () => {
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
