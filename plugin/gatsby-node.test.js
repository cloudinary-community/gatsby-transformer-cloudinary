import Joi from 'joi';
import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import { pluginOptionsSchema } from './gatsby-node';

describe('pluginOptionsSchema', () => {
  test('should validate minimal correct options', async () => {
    // cloudName, apiKey, apiSecret
    // only needed if uploading
    const options = {};

    const { isValid } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    );

    expect(isValid).toBe(true);
  });

  test('should invalidate incorrect options', async () => {
    const options = {
      cloudName: 120,
      apiKey: '',
      apiSecret: false,
      uploadFolder: ['test'],
      uploadSourceInstanceNames: 'instanceName',
      transformTypes: [123],
      overwriteExisting: 3,
      defaultTransformations: null,
    };

    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    );

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      `"cloudName" must be a string`,
      `"apiKey" is not allowed to be empty`,
      `"apiSecret" must be a string`,
      `"uploadFolder" must be a string`,
      `"uploadSourceInstanceNames" must be an array`,
      `"transformTypes[0]" does not match any of the allowed types`,
      `"overwriteExisting" must be a boolean`,
      `"defaultTransformations" must be an array`,
    ]);
  });

  test('should invalidate incorrect transform type config', async () => {
    // cloudName, apiKey, apiSecret
    // only needed if uploading
    const options = {
      transformTypes: [
        'Type0',
        {
          type: 'Type1',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: () => 400,
          width: 700,
          format: () => 'jpg',
          base64: () => 'base64',
          tracedSVG: () => 'tracedSVG',
        },
        {
          type: undefined, // Missing type
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: () => 400,
          width: 700,
          format: () => 'jpg',
          base64: () => 'base64',
          tracedSVG: () => 'tracedSVG',
        },
        {
          type: 'Type3',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: 'test', // height is string, not number or function
          width: 700,
          format: () => 'jpg',
          base64: () => 'base64',
          tracedSVG: () => 'tracedSVG',
        },
        {
          type: 'Type4',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: 300,
          width: 'test', // width is string, not number or function
          format: () => 'jpg',
          base64: 'base64',
          tracedSVG: 'tracedSVG',
        },
        {
          type: 'Type5',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: 300,
          width: () => 200,
          format: new Date('Hello'), // format is not string or function
          base64: () => 'base64',
          tracedSVG: () => 'tracedSVG',
        },
        {
          type: 'Type6',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: 300,
          width: () => 200,
          format: 'png',
          base64: 2342, // base64 is not string or function
          tracedSVG: () => 'tracedSVG',
        },
        {
          type: 'Type7',
          cloudName: 'cloud_name',
          publicId: 'public_id',
          height: 300,
          width: () => 200,
          format: 'png',
          base64: 'base64',
          tracedSVG: 224, // tracedSVG is not string or function
        },
      ],
    };

    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    );

    expect(isValid).toBe(false);
    expect(errors).toEqual([
      `"transformTypes[2]" does not match any of the allowed types`,
      `"transformTypes[3]" does not match any of the allowed types`,
      `"transformTypes[4]" does not match any of the allowed types`,
      `"transformTypes[5]" does not match any of the allowed types`,
      `"transformTypes[6]" does not match any of the allowed types`,
      `"transformTypes[7]" does not match any of the allowed types`,
    ]);
  });

  test('should add defaults', async () => {
    const schema = pluginOptionsSchema({ Joi });
    const options = {
      cloudName: 'cloudName',
      apiKey: 'apiKey',
      apiSecret: 'apiSecret',
    };
    const { value } = schema.validate(options);

    expect(value).toEqual({
      ...options,
      transformTypes: ['CloudinaryAsset'],
      overwriteExisting: false,
      defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
    });
  });
});
