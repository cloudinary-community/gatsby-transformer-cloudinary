const { getFluidImageObject } = require('./get-image-objects');

jest.mock('./options');
jest.mock('axios');

const axios = require('axios');
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

beforeEach(() => {
  axios.get = jest.fn(() => ({ data: ['1', '2', '3'] }));
});

test('getFluidImageObject returns presentationWidth=fluidMaxWidth when fluidMaxWidth is smaller', async () => {
  const options = getDefaultOptions();
  getPluginOptions.mockReturnValue(options);
  const args = getDefaultArgs();

  const presentationWidth = options.fluidMaxWidth;
  expect(await getFluidImageObject(args)).toEqual(
    expect.objectContaining({ presentationWidth }),
  );
});

test('getFluidImageObject returns presentationWidth=originalWidth when originalWidth is smaller', async () => {
  const options = getDefaultOptions({ fluidMaxWidth: 10000 });
  getPluginOptions.mockReturnValue(options);
  const args = getDefaultArgs();

  const presentationWidth = args.originalWidth;
  expect(await getFluidImageObject(args)).toEqual(
    expect.objectContaining({ presentationWidth }),
  );
});

test('getFluidImageObject calculates presentation height', async () => {
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
