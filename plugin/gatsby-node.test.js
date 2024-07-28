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
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: () => 400,
            width: 'the_width',
            format: () => 'jpg',
            base64: () => 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: undefined, // Missing type
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: () => 400,
            width: 'the_width',
            format: () => 'jpg',
            base64: () => 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type3',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: 400, // is not a function or string
            width: 'the_width',
            format: () => 'jpg',
            base64: () => 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type4',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: 'the_height',
            width: 700, // is not a function or string
            format: () => 'jpg',
            base64: 'base64',
            tracedSVG: 'tracedSVG',
          },
        },
        {
          type: 'Type5',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: () => 400,
            width: 'the_width',
            format: new Date('Hello'), // is not a function or string
            base64: () => 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type6',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 2342, // is not a function or string
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type7',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 'base64',
            tracedSVG: 224, // is not a function or string
          },
        },
        {
          type: 'Type8',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            secure: 123, // is not a function or string
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type9',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            secure: () => false,
            privateCdn: 123, // is not a function or string
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type10',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            secure: () => false,
            privateCdn: () => true,
            secureDistribution: 123, // is not a function or string
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 'base64',
            tracedSVG: () => 'tracedSVG',
          },
        },
        {
          type: 'Type11',
          mapping: {
            cloudName: 'cloud_name',
            publicId: 'public_id',
            secure: () => false,
            privateCdn: () => true,
            secureDistribution: 'secureDistribution',
            cname: false, // is not a function or string
            height: () => 400,
            width: 'the_width',
            format: 'png',
            base64: 'base64',
            tracedSVG: () => 'tracedSVG',
          },
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
      `"transformTypes[8]" does not match any of the allowed types`,
      `"transformTypes[9]" does not match any of the allowed types`,
      `"transformTypes[10]" does not match any of the allowed types`,
      `"transformTypes[11]" does not match any of the allowed types`,
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
