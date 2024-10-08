jest.mock('gatsby-plugin-image');
jest.mock('./asset-data');

const gatsbyUtilsMocks = {
  reporter: {
    panic: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
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
  _generateCloudinaryImageSource,
  createResolveCloudinaryAssetData,
} = require('./resolve-asset');

describe('_generateCloudinaryImageSource', () => {
  const cldAssetData = {
    cloudName: 'cloud-name',
    publicId: 'public-id',
    width: 300,
    height: 500,
    format: 'jpg',
  };
  const filename = 'cloud-name>>>public-id';
  const width = cldAssetData.width;
  const height = cldAssetData.height;
  const format = cldAssetData.format;
  const fit = undefined;

  describe('generated correct source data', () => {
    it('when no options', () => {
      const options = {};

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_500,w_300/public-id'
      );
      expect(result.width).toBe(width);
      expect(result.height).toBe(height);
      expect(result.format).toBe(format);
    });

    it('with secure option set to true', () => {
      const options = { secure: true };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'https://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_500,w_300/public-id'
      );
    });

    it('with custom secure_distribution (cname) and secure is true', () => {
      const options = { secure: true, secureDistribution: 'example.com' };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'https://example.com/cloud-name/image/upload/f_jpg,h_500,w_300/public-id'
      );
    });

    it('with cname and secure is false', () => {
      const options = { secure: false, cname: 'example.com' };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'http://example.com/cloud-name/image/upload/f_jpg,h_500,w_300/public-id'
      );
    });
    it('for private_cdn and secure is true', () => {
      const options = { secure: true, privateCdn: true };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'https://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_500,w_300/public-id'
      );
    });

    it('for private_cdn and secure is false', () => {
      const options = { secure: false, privateCdn: true };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'http://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_500,w_300/public-id'
      );
    });

    it('with transformations and chained options', () => {
      const options = {
        chained: ['t_lwj'],
        transformations: ['e_grayscale', 'e_pixelate'],
      };

      const result = _generateCloudinaryImageSource(cldAssetData)(
        filename,
        width,
        height,
        format,
        fit,
        options
      );

      expect(result.src).toContain(
        'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_500,w_300,e_grayscale,e_pixelate/t_lwj/public-id'
      );
    });
  });
});

describe('resolveCloudinaryAssetData', () => {
  const resolveCloudinaryAssetData = createResolveCloudinaryAssetData(
    gatsbyUtilsMocks,
    {
      type: 'CloudinaryAsset',
      cloudName: () => undefined, // Should defer to mapping
      secure: (data) => data.secure,
      secureDistribution: (data) => data.secureDistribution,
      cname: (data) => data.cname,
      privateCdn: (data) => data.privateCdn,
      publicId: (data) => data.publicId,
      height: () => undefined, // Should defer to mapping
      width: (data) => data.width,
      format: (data) => data.format,
      base64: (data) => data.base64,
      tracedSVG: (data) => data.tracedSVG,
      mapping: {
        cloudName: (data) => data.cloudName,
        publicId: (data) => data.publicId,
        height: () => 300,
        width: (data) => data.width,
        format: (data) => data.format,
        base64: (data) => data.base64,
        tracedSVG: (data) => data.tracedSVG,
      },
    }
  );

  const sourceWithMetadata = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    originalWidth: '600',
    // originalHeight: '300',
    originalFormat: 'jpg',
  };

  const sourceWithoutFormat = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    width: '600',
    // height: '300',
  };

  const sourceWithoutMeta = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
  };

  const sourceWithPlaceholder = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    originalWidth: '600',
    // originalHeight: '300',
    originalFormat: 'jpg',
    defaultBase64: 'defaultBase64DataUrl',
    tracedSVG: 'defaultSvgDataUrl',
  };

  const context = {}; // Never used
  const info = {};

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

  it('calls gatsby-plugin-image -> generateImageData once', async () => {
    const args = {};
    await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
    expect(generateImageData).toBeCalledTimes(1);
  });

  it('calls gatsby-plugin-image -> generateImageData with correct data', async () => {
    const args = { transformations: ['e_grayscale'] };
    await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
    await resolveCloudinaryAssetData(sourceWithoutFormat, args, context, info);

    expect(getAssetMetadata).toBeCalledTimes(0);
    expect(generateImageData).toBeCalledTimes(2);

    expect(generateImageData).toHaveBeenNthCalledWith(1, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: {
        transformations: ['e_grayscale'],
      },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: 300,
        width: 600,
      },
      transformations: ['e_grayscale'],
    });

    expect(generateImageData).toHaveBeenNthCalledWith(2, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: {
        transformations: ['e_grayscale'],
      },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'auto',
        height: 300,
        width: 600,
      },
      transformations: ['e_grayscale'],
    });
  });

  it('fetches metadata when not present on source', async () => {
    const args = {};
    await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
    await resolveCloudinaryAssetData(sourceWithoutMeta, args, context, info);
    // getAssetMetadata should only be called for sourceWithoutMeta
    expect(getAssetMetadata).toBeCalledTimes(1);
    expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
    // gatsby-plugin-image -> generateImageData should be called for both
    expect(generateImageData).toBeCalledTimes(2);
    expect(generateImageData).toHaveBeenNthCalledWith(2, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
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
    const args = { placeholder: 'blurred' };
    await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
    await resolveCloudinaryAssetData(
      sourceWithPlaceholder,
      args,
      context,
      info
    );

    expect(getLowResolutionImageURL).toBeCalledTimes(1);
    expect(getUrlAsBase64Image).toBeCalledTimes(1);
    expect(generateImageData).toBeCalledTimes(2);
    expect(generateImageData).toHaveBeenNthCalledWith(1, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: { placeholder: 'blurred' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: 300,
        width: 600,
      },
      placeholderURL: 'base64DataUrl',
      placeholder: 'blurred',
    });
    expect(generateImageData).toHaveBeenNthCalledWith(2, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: { placeholder: 'blurred' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: 300,
        width: 600,
      },
      placeholderURL: 'defaultBase64DataUrl',
      placeholder: 'blurred',
    });
  });

  it('fetches and adds correct "tracedSVG" placeholder', async () => {
    const args = { placeholder: 'tracedSVG' };
    await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
    await resolveCloudinaryAssetData(
      sourceWithPlaceholder,
      args,
      context,
      info
    );

    expect(getAssetAsTracedSvg).toBeCalledTimes(1);
    expect(generateImageData).toBeCalledTimes(2);
    expect(generateImageData).toHaveBeenNthCalledWith(1, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: { placeholder: 'tracedSVG' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: 300,
        width: 600,
      },
      placeholderURL: 'svgDataUrl',
      placeholder: 'tracedSVG',
    });
    expect(generateImageData).toHaveBeenNthCalledWith(2, {
      filename: 'cloud-name>>>public-id',
      generateImageSource: expect.any(Function),
      options: { placeholder: 'tracedSVG' },
      pluginName: 'gatsby-transformer-cloudinary',
      sourceMetadata: {
        format: 'jpg',
        height: 300,
        width: 600,
      },
      placeholderURL: 'defaultSvgDataUrl',
      placeholder: 'tracedSVG',
    });
  });

  describe('when unconforming source', () => {
    it('calls reporter.verbose and returns null for empty source', async () => {
      const source = {};
      const args = {};
      const result = await resolveCloudinaryAssetData(
        source,
        args,
        context,
        info
      );
      expect(generateImageData).toBeCalledTimes(0);
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
      expect(result).toBe(null);
    });

    describe('returns null for weird source', () => {
      it('calls reporter.verbose when undefined log level', async () => {
        const source = {
          one: 'thing',
          another: 'thang',
        };
        const args = {};
        const result = await resolveCloudinaryAssetData(
          source,
          args,
          context,
          info
        );
        expect(generateImageData).toBeCalledTimes(0);
        expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
        expect(result).toBe(null);
      });

      it('calls reporter.verbose when log level = "verbose"', async () => {
        const source = {
          one: 'thing',
          another: 'thang',
        };
        const args = {
          logLevel: 'verbose',
        };
        const result = await resolveCloudinaryAssetData(
          source,
          args,
          context,
          info
        );
        expect(generateImageData).toBeCalledTimes(0);
        expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
        expect(result).toBe(null);
      });

      it('does not call reporter.verbose when log level = "warn"', async () => {
        const source = {
          one: 'thing',
          another: 'thang',
        };
        const args = {
          logLevel: 'warn',
        };
        const result = await resolveCloudinaryAssetData(
          source,
          args,
          context,
          info
        );
        expect(generateImageData).toBeCalledTimes(0);
        expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(0);
        expect(result).toBe(null);
      });
    });

    it('calls reporter.verbose and returns null for null source', async () => {
      const source = null;
      const args = {};
      const result = await resolveCloudinaryAssetData(
        source,
        args,
        context,
        info
      );
      expect(generateImageData).toBeCalledTimes(0);
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
      expect(result).toBe(null);
    });

    it('calls reporter.verbose and returns null for undefined source', async () => {
      const source = undefined;
      const args = {};
      const result = await resolveCloudinaryAssetData(
        source,
        args,
        context,
        info
      );
      expect(generateImageData).toBeCalledTimes(0);
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(1);
      expect(result).toBe(null);
    });

    describe('returns null for missing data', () => {
      it('returns null for missing data when log level is undefined', async () => {
        const source = {
          publicId: 'publicId',
          one: 'thing',
        };
        const args = {};
        const result = await resolveCloudinaryAssetData(
          source,
          args,
          context,
          info
        );
        expect(generateImageData).toBeCalledTimes(0);
        expect(gatsbyUtilsMocks.reporter.warn).toBeCalledTimes(1);
        expect(result).toBe(null);
      });

      it('does not call reporter.warn when log level = "error"', async () => {
        const source = {
          publicId: 'publicId',
          one: 'thing',
        };
        const args = {
          logLevel: 'error',
        };
        const result = await resolveCloudinaryAssetData(
          source,
          args,
          context,
          info
        );
        expect(generateImageData).toBeCalledTimes(0);
        expect(gatsbyUtilsMocks.reporter.warn).toBeCalledTimes(0);
        expect(result).toBe(null);
      });
    });
  });

  describe('when fetched asset metadata is invalid', () => {
    beforeEach(() => {
      getAssetMetadata.mockResolvedValue({
        width: 100,
        //  height: 200,
        //  format: 'gif',
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('calls reporter.verbose on invalid metadata and returns null', async () => {
      const args = {};
      const result = await resolveCloudinaryAssetData(
        sourceWithoutMeta,
        args,
        context,
        info
      );
      expect(getAssetMetadata).toBeCalledTimes(1);
      expect(generateImageData).toBeCalledTimes(0);
      // Once to notify invalid original metadata
      // Once to notify about invalid fetched metadata
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(2);
      expect(result).toBe(null);
    });
  });

  describe('when fetched asset metadata is undefined', () => {
    beforeEach(() => {
      getAssetMetadata.mockResolvedValue(undefined);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('calls reporter.verbose on undefined metadata and returns null', async () => {
      const args = {};
      const result = await resolveCloudinaryAssetData(
        sourceWithoutMeta,
        args,
        context,
        info
      );
      expect(getAssetMetadata).toBeCalledTimes(1);
      expect(generateImageData).toBeCalledTimes(0);
      // Once to notify invalid original metadata
      // Once to notify about invalid fetched metadata
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(2);
      expect(result).toBe(null);
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

    it('calls reporter.verbose on metadata error and returns null', async () => {
      const args = {};
      const result = await resolveCloudinaryAssetData(
        sourceWithoutMeta,
        args,
        context,
        info
      );
      expect(getAssetMetadata).toBeCalledTimes(1);
      expect(generateImageData).toBeCalledTimes(0);
      // Once to notify invalid original metadata
      // Once to notify about invalid fetched metadata
      expect(gatsbyUtilsMocks.reporter.verbose).toBeCalledTimes(2);
      expect(result).toBe(null);
    });

    it('calls reporter.error on blurred placeholder error', async () => {
      const args = { placeholder: 'blurred' };
      await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
      expect(getLowResolutionImageURL).toBeCalledTimes(1);
      expect(getUrlAsBase64Image).toBeCalledTimes(1);
      expect(gatsbyUtilsMocks.reporter.error).toBeCalledTimes(1);
      expect(generateImageData).toHaveBeenCalledWith({
        filename: 'cloud-name>>>public-id',
        generateImageSource: expect.any(Function),
        options: { placeholder: 'blurred' },
        pluginName: 'gatsby-transformer-cloudinary',
        sourceMetadata: {
          format: 'jpg',
          height: 300,
          width: 600,
        },
        //  placeholderURL: 'base64DataUrl',
        placeholder: 'blurred',
      });
    });

    it('calls reporter.error on tracedSVG placeholder error', async () => {
      const args = { placeholder: 'tracedSVG' };
      await resolveCloudinaryAssetData(sourceWithMetadata, args, context, info);
      expect(getAssetAsTracedSvg).toBeCalledTimes(1);
      expect(gatsbyUtilsMocks.reporter.error).toBeCalledTimes(1);
      expect(generateImageData).toHaveBeenCalledWith({
        filename: 'cloud-name>>>public-id',
        generateImageSource: expect.any(Function),
        options: { placeholder: 'tracedSVG' },
        pluginName: 'gatsby-transformer-cloudinary',
        sourceMetadata: {
          format: 'jpg',
          height: 300,
          width: 600,
        },
        // placeholderURL: 'svgDataUrl',
        placeholder: 'tracedSVG',
      });
    });
  });
});
