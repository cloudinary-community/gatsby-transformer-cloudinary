jest.mock('axios');

const axios = require('axios');
const {
  getAssetMetadata,
  getUrlAsBase64Image,
  getAssetAsTracedSvg,
} = require('./asset-data');

const source = {
  publicId: 'public-id',
  cloudName: 'cloud-name',
};

const args = {
  transformations: ['e_grayscale'],
};

describe('getAssetMetaData', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { output: 'metadata' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the correct metadata url', async () => {
    await getAssetMetadata({ source, args });
    expect(axios.get).toHaveBeenCalledWith(
      `http://res.cloudinary.com/cloud-name/image/upload/e_grayscale/fl_getinfo/public-id`,
      undefined
    );
  });

  it('returns the metadata', async () => {
    const metadata = await getAssetMetadata({ source, args });
    expect(metadata).toBe('metadata');
  });

  it('to cache responses', async () => {
    await getAssetMetadata({ source, args: {} });
    await getAssetMetadata({ source, args: {} });
    await getAssetMetadata({ source, args: { chained: ['t_lwj'] } });
    await getAssetMetadata({ source, args: { chained: ['t_lwj'] } });
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

describe('getUrlAsBase64Image', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: '49 27 6d 20 61 20 73 74 72 69 6e 67 21',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches an arraybuffer from the url', async () => {
    await getUrlAsBase64Image('example-url');
    expect(axios.get).toHaveBeenCalledWith(`example-url`, {
      responseType: 'arraybuffer',
    });
  });

  it('returns the base64 data url', async () => {
    const base64 = await getUrlAsBase64Image('example-url');
    expect(base64).toBe(
      'data:image/jpeg;base64,NDkgMjcgNmQgMjAgNjEgMjAgNzMgNzQgNzIgNjkgNmUgNjcgMjE='
    );
  });

  it('to cache responses', async () => {
    await getUrlAsBase64Image('one-url');
    await getUrlAsBase64Image('one-url');
    await getUrlAsBase64Image('another-url');
    await getUrlAsBase64Image('another-url');
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

describe('getAssetAsTracedSvg', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: '<svg path.....>',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the correct url', async () => {
    await getAssetAsTracedSvg({ source, args });
    expect(axios.get).toHaveBeenCalledWith(
      `http://res.cloudinary.com/cloud-name/image/upload/f_svg,e_grayscale/e_vectorize:colors:2:detail:0.3:despeckle:0.1,w_300/public-id`,
      undefined
    );
  });

  it('returns the svg as data url', async () => {
    const svg = await getAssetAsTracedSvg({ source, args });
    expect(svg).toBe('data:image/svg+xml,%3Csvg%20path.....%3E');
  });

  it('to cache responses', async () => {
    await getAssetAsTracedSvg({ source, args: {} });
    await getAssetAsTracedSvg({ source, args: {} });
    await getAssetAsTracedSvg({ source, args: { chained: ['t_lwj'] } });
    await getAssetAsTracedSvg({ source, args: { chained: ['t_lwj'] } });
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
