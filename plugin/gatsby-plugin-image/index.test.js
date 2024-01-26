const {
  createGatsbyImageDataResolver,
  _amendTransformTypeConfig,
} = require('./index');

const gatsbyUtilsMocks = {
  createResolvers: jest.fn(),
};

describe('_amendTransformTypeConfig', () => {
  it('defaults to using the field name as key', () => {
    const originalConfig = 'CloudinaryAsset';
    const ammenedConfig = _amendTransformTypeConfig(originalConfig);

    const source = {
      publicId: 'a publicId',
      cloudName: 'a cloudName',
      height: 300,
      width: 200,
      format: 'a format',
      base64: 'a base64',
      tracedSVG: 'a tracedSVG',
    };

    expect({
      publicId: ammenedConfig.publicId(source),
      cloudName: ammenedConfig.cloudName(source),
      height: ammenedConfig.height(source),
      width: ammenedConfig.width(source),
      format: ammenedConfig.format(source),
      base64: ammenedConfig.base64(source),
      tracedSVG: ammenedConfig.tracedSVG(source),
    }).toEqual(source);
  });

  it('allows field name config', () => {
    const originalConfig = {
      type: 'CloudinaryAsset',
      publicId: 'field1',
      cloudName: 'field2',
      height: 'field3',
      width: 'field4',
      format: 'field5',
      base64: 'field6',
      tracedSVG: 'field7',
    };
    const ammenedConfig = _amendTransformTypeConfig(originalConfig);

    const source = {
      field1: 'a publicId',
      field2: 'a cloudName',
      field3: 300,
      field4: 200,
      field5: 'a format',
      field6: 'a base64',
      field7: 'a tracedSVG',
    };

    const asset = {
      publicId: 'a publicId',
      cloudName: 'a cloudName',
      height: 300,
      width: 200,
      format: 'a format',
      base64: 'a base64',
      tracedSVG: 'a tracedSVG',
    };

    expect({
      publicId: ammenedConfig.publicId(source),
      cloudName: ammenedConfig.cloudName(source),
      height: ammenedConfig.height(source),
      width: ammenedConfig.width(source),
      format: ammenedConfig.format(source),
      base64: ammenedConfig.base64(source),
      tracedSVG: ammenedConfig.tracedSVG(source),
    }).toEqual(asset);
  });

  it('allows function config', () => {
    const originalConfig = {
      type: 'CloudinaryAsset',
      publicId: (source) => {
        return source.field1;
      },
      cloudName: () => {
        return 'cloud five';
      },
      height: (source) => {
        return source.field3.height;
      },
      width: () => {
        return 200;
      },
      format: (source) => {
        return source.field5.toLowerCase();
      },
      base64: (source) => {
        return source.field6.toUpperCase();
      },
      tracedSVG: (source) => {
        return undefined;
      },
    };
    const ammenedConfig = _amendTransformTypeConfig(originalConfig);

    const source = {
      field1: 'a publicId',
      field2: 'a cloudName', // will not be used
      field3: { height: 300 },
      field4: 200, // will not be used
      field5: 'A FORMAT',
      field6: 'a base64',
      field7: 'a tracedSVG', // will not be used
    };

    const asset = {
      publicId: 'a publicId',
      cloudName: 'cloud five',
      height: 300,
      width: 200,
      format: 'a format',
      base64: 'A BASE64',
      tracedSVG: undefined,
    };

    expect({
      publicId: ammenedConfig.publicId(source),
      cloudName: ammenedConfig.cloudName(source),
      height: ammenedConfig.height(source),
      width: ammenedConfig.width(source),
      format: ammenedConfig.format(source),
      base64: ammenedConfig.base64(source),
      tracedSVG: ammenedConfig.tracedSVG(source),
    }).toEqual(asset);
  });
});

describe('createGatsbyImageDataResolver', () => {
  it('creates a resolver', () => {
    const pluginOptions = {
      defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
      transformTypes: ['CloudinaryAsset', { type: 'CloudinaryAsset2' }],
    };

    createGatsbyImageDataResolver(gatsbyUtilsMocks, pluginOptions);

    expect(gatsbyUtilsMocks.createResolvers).toBeCalledWith({
      CloudinaryAsset: expect.objectContaining({
        gatsbyImageData: expect.objectContaining({
          type: 'GatsbyImageData',
          resolve: expect.any(Function),
          args: expect.objectContaining({
            transformations: expect.objectContaining({
              defaultValue: ['c_fill', 'g_auto', 'q_auto'],
              type: '[String]',
            }),
            secure: expect.objectContaining({
              defaultValue: true,
              type: 'Boolean',
            }),
          }),
        }),
      }),
      CloudinaryAsset2: expect.objectContaining({
        gatsbyImageData: expect.objectContaining({
          type: 'GatsbyImageData',
          resolve: expect.any(Function),
          args: expect.objectContaining({
            transformations: expect.objectContaining({
              defaultValue: ['c_fill', 'g_auto', 'q_auto'],
              type: '[String]',
            }),
            secure: expect.objectContaining({
              defaultValue: true,
              type: 'Boolean',
            }),
          }),
        }),
      }),
    });
  });
});
