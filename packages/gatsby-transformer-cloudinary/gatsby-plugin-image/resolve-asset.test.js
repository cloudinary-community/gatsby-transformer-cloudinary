jest.mock('gatsby-plugin-image');
jest.mock('./asset-data');

const gatsbyUtilsMocks = {
  reporter: {
    error: jest.fn(),
    panic: jest.fn(),
    verbose: jest.fn(),
  },
};

const {
  getLowResolutionImageURL,
  generateImageData,
} = require('gatsby-plugin-image');

const {
  getAssetAsTracedSvg,
  getAssetMetadata,
  getUrlAsBase64Image,
} = require('./asset-data');

const {
  _generateCloudinaryAssetSource,
  createResolveCloudinaryAssetData,
} = require('./resolve-asset');

const resolveCloudinaryAssetData =
  createResolveCloudinaryAssetData(gatsbyUtilsMocks);

describe('generateCloudinaryAssetSource', () => {
  const filename = 'cloud-name>>>public-id';
  const width = 300;
  const height = 500;
  const format = 'jpg';
  const fit = undefined;
  const options = {
    chained: ['t_lwj'],
  };
  it('generated correct source data', () => {
    const result = _generateCloudinaryAssetSource(
      filename,
      width,
      height,
      format,
      fit,
      options
    );

    expect(result.src).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_500,w_300/t_lwj/public-id'
    );
    expect(result.width).toBe(width);
    expect(result.height).toBe(height);
    expect(result.format).toBe(format);
  });
});

describe('resolveCloudinaryAssetData', () => {
  const source = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    originalWidth: '600',
    originalHeight: '300',
    originalFormat: 'jpg',
  };

  const args = {
    transformations: ['e_grayscale'],
  };

  beforeEach(() => {
    getAssetMetadata.mockResolvedValue({
      width: 100,
      height: 200,
      format: 'gif',
    });
    getUrlAsBase64Image.mockResolvedValue('base64DataUrl');
    getAssetAsTracedSvg.mockResolvedValue('svgDataUrl');
    getLowResolutionImageURL.mockResolvedValue('low-resultion-url');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls gatsby-plugin-image -> generateImageData', async () => {
    await resolveCloudinaryAssetData(source, args);
    expect(generateImageData).toBeCalledTimes(1);
  });

  it('calls gatsby-plugin-image -> generateImageData with correct data', async () => {
    await resolveCloudinaryAssetData(source, args);
    expect(generateImageData).toBeCalledWith({
      filename: 'cloud-name>>>public-id',
      generateImageSource: _generateCloudinaryAssetSource,
      options: {
        transformations: ['e_grayscale'],
      },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: '300',
        width: '600',
      },
      transformations: ['e_grayscale'],
    });
  });

  it('fetches metadata when not present on source', async () => {
    await resolveCloudinaryAssetData(source, {});
    await resolveCloudinaryAssetData(
      { publicId: 'public-id', cloudName: 'cloud-name' },
      {}
    );
    expect(getAssetMetadata).toBeCalledTimes(1);
    expect(generateImageData).toHaveBeenNthCalledWith(2, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: _generateCloudinaryAssetSource,
      options: {},
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'gif',
        height: 200,
        width: 100,
      },
    });
  });

  it('fetches and adds correct "blurred" placeholder', async () => {
    await resolveCloudinaryAssetData(source, { placeholder: 'blurred' });

    expect(getLowResolutionImageURL).toBeCalledTimes(1);
    expect(getUrlAsBase64Image).toBeCalledTimes(1);
    expect(generateImageData).toHaveBeenCalledWith({
      filename: 'cloud-name>>>public-id',
      generateImageSource: _generateCloudinaryAssetSource,
      options: { placeholder: 'blurred' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: '300',
        width: '600',
      },
      placeholderURL: 'base64DataUrl',
      placeholder: 'blurred',
    });
  });

  it('fetches and adds correct "tracedSVG" placeholder', async () => {
    await resolveCloudinaryAssetData(source, { placeholder: 'tracedSVG' });

    expect(getAssetAsTracedSvg).toBeCalledTimes(1);
    expect(generateImageData).toHaveBeenCalledWith({
      filename: 'cloud-name>>>public-id',
      generateImageSource: _generateCloudinaryAssetSource,
      options: { placeholder: 'tracedSVG' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: '300',
        width: '600',
      },
      placeholderURL: 'svgDataUrl',
      placeholder: 'tracedSVG',
    });
  });

  describe('when error fetching asset data', () => {
    beforeEach(() => {
      getAssetMetadata.mockImplementation(() => {
        throw new Error();
      });
      getUrlAsBase64Image.mockImplementation(() => {
        throw new Error();
      });
      getAssetAsTracedSvg.mockImplementation(() => {
        throw new Error();
      });
      getLowResolutionImageURL.mockResolvedValue('low-resultion-url');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('reporter.panic on fetching metdata error', async () => {
      await resolveCloudinaryAssetData(
        { publicId: 'public-id', cloudName: 'cloud-name' },
        {}
      );
      expect(getAssetMetadata).toBeCalledTimes(1);
      expect(gatsbyUtilsMocks.reporter.panic).toBeCalledTimes(1);
    });

    it('reporter.errror on fetching blurred placeholder error', async () => {
      await resolveCloudinaryAssetData(source, { placeholder: 'blurred' });
      expect(getLowResolutionImageURL).toBeCalledTimes(1);
      expect(getUrlAsBase64Image).toBeCalledTimes(1);
      expect(gatsbyUtilsMocks.reporter.error).toBeCalledTimes(1);
      expect(generateImageData).toHaveBeenCalledWith({
        filename: 'cloud-name>>>public-id',
        generateImageSource: _generateCloudinaryAssetSource,
        options: { placeholder: 'blurred' },
        pluginName: 'gatsby-transformer-cloudinary',
        sourceMetadata: {
          format: 'jpg',
          height: '300',
          width: '600',
        },
        //  placeholderURL: 'base64DataUrl',
        placeholder: 'blurred',
      });
    });

    it('reporter.errror on fetching tracedSVG placeholder error', async () => {
      await resolveCloudinaryAssetData(source, { placeholder: 'tracedSVG' });
      expect(getAssetAsTracedSvg).toBeCalledTimes(1);
      expect(gatsbyUtilsMocks.reporter.error).toBeCalledTimes(1);
      expect(generateImageData).toHaveBeenCalledWith({
        filename: 'cloud-name>>>public-id',
        generateImageSource: _generateCloudinaryAssetSource,
        options: { placeholder: 'tracedSVG' },
        pluginName: 'gatsby-transformer-cloudinary',
        sourceMetadata: {
          format: 'jpg',
          height: '300',
          width: '600',
        },
        // placeholderURL: 'svgDataUrl',
        placeholder: 'tracedSVG',
      });
    });
  });
});