const { uploadImageToCloudinary } = require('./upload');

jest.mock('./options');
jest.mock('cloudinary');

const { getPluginOptions } = require('./options');
const cloudinary = require('cloudinary').v2;

describe('uploadImageToCloudinary', () => {
  function getDefaultArgs(args) {
    return {
      url: 'url',
      overwrite: 'overwrite',
      publicId: 'publicId',
      reporter: {
        info: jest.fn(),
        warn: jest.fn(),
        panic: jest.fn(),
      },
      ...args,
    };
  }

  function getDefaultOptions(options) {
    return {
      cloudName: 'cloudName',
      apiKey: 'apiKey',
      apiSecret: 'apiSecret',
      uploadFolder: 'uploadFolder',
      createDerived: false,
      breakpointsMaxImages: 234,
      fluidMaxWidth: 345,
      fluidMinWidth: 456,
      ...options,
    };
  }

  test('configures cloudinary with the appropriate plugin options', async () => {
    const cloudinaryConfig = jest.fn();
    cloudinary.config = cloudinaryConfig;

    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs();
    await uploadImageToCloudinary(args);

    const expected = {
      cloud_name: options.cloudName,
      api_key: options.apiKey,
      api_secret: options.apiSecret,
    };
    expect(cloudinaryConfig).toHaveBeenCalledWith(expected);
  });

  test('does not ask for responsive breakpoints when useCloudinaryBreakpoints is false', async () => {
    const cloudinaryUpload = jest.fn();
    cloudinary.uploader.upload = cloudinaryUpload;

    const options = getDefaultOptions({ useCloudinaryBreakpoints: false });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs();
    await uploadImageToCloudinary(args);

    const expectedUrl = args.url;
    const expectedOptions = {
      folder: options.uploadFolder,
      overwrite: args.overwrite,
      public_id: args.publicId,
      resource_type: 'auto',
      timeout: 5 * 60 * 1000,
    };
    expect(cloudinaryUpload).toHaveBeenCalledWith(expectedUrl, expectedOptions);
  });

  test('asks for responsive breakpoints when useCloudinaryBreakpoints is true', async () => {
    const cloudinaryUpload = jest.fn();
    cloudinary.uploader.upload = cloudinaryUpload;

    const options = getDefaultOptions({
      useCloudinaryBreakpoints: true,
      createDerived: 'createDerived',
    });
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs();
    await uploadImageToCloudinary(args);

    const expectedUrl = args.url;
    const expectedOptions = {
      folder: options.uploadFolder,
      overwrite: args.overwrite,
      public_id: args.publicId,
      resource_type: 'auto',
      timeout: 5 * 60 * 1000,
      responsive_breakpoints: [
        {
          bytes_step: 20000,
          create_derived: options.createDerived,
          max_images: options.breakpointsMaxImages,
          max_width: options.fluidMaxWidth,
          min_width: options.fluidMinWidth,
        },
      ],
    };
    expect(cloudinaryUpload).toHaveBeenCalledWith(expectedUrl, expectedOptions);
  });

  test('returns the result returned from the Cloudinary uploader', async () => {
    const cloudinaryUpload = jest.fn();
    const cloudinaryUploadResult = 'cloudinaryUploadResult';
    cloudinaryUpload.mockReturnValue(cloudinaryUploadResult);
    cloudinary.uploader.upload = cloudinaryUpload;

    const options = getDefaultOptions();
    getPluginOptions.mockReturnValue(options);

    const args = getDefaultArgs();
    expect(await uploadImageToCloudinary(args)).toEqual(cloudinaryUploadResult);
  });
});
