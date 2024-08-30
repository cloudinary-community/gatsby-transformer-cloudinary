jest.mock('../package.json', () => ({
  version: '0.1.2',
}));
jest.mock('gatsby/package.json', () => ({
  version: '0.5.3',
}));

const { generateCloudinaryAssetUrl } = require('./generate-asset-url');

const ANALYTICS_CODE = 'AXE6EH00';

describe('generateCloudinaryAssetUrl', () => {
  const cldAssetData = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    width: 2450,
    height: 4503,
    format: 'png',
  };

  describe('generates correct Cloudinary url', () => {
    it('when no transformation', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        cldAssetData: cldAssetData,
      });
      expect(url).toBe(
        `http://res.cloudinary.com/cloud-name/image/upload/f_auto,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with transformations option', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          transformations: ['e_grayscale', 'e_pixelate'],
        },
      });
      expect(url).toBe(
        `http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400,e_grayscale,e_pixelate/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with chained option', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          chained: ['t_lwj', 'e_pixelate'],
        },
      });
      expect(url).toBe(
        `http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/t_lwj/e_pixelate/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with secure option set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          secure: true,
        },
      });
      expect(url).toBe(
        `https://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with secure cldAssetData set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, secure: true },
      });
      expect(url).toBe(
        `https://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with secure cldAssetData set to true and secure option set to false', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, secure: true },
        options: { secure: false },
      });
      expect(url).toBe(
        `http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom secure_distribution option and secure option set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          secure: true,
          secureDistribution: 'example.com',
        },
      });
      expect(url).toBe(
        `https://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom secure_distribution cldAssetData and secure option set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, secureDistribution: 'example.com' },
        options: {
          secure: true,
        },
      });
      expect(url).toBe(
        `https://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom secure_distribution cldAssetData and secure cldAssetData set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: {
          ...cldAssetData,
          secureDistribution: 'example.com',
          secure: true,
        },
      });
      expect(url).toBe(
        `https://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom cname option/cldAssetData and secure option set to false', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: {
          ...cldAssetData,
          cname: 'example-shoud-be-overriden.com',
        },
        options: {
          secure: false,
          cname: 'example.com',
        },
      });
      expect(url).toBe(
        `http://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom cname option and secure cldAssetData set to false', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, secure: false },
        options: {
          cname: 'example.com',
        },
      });
      expect(url).toBe(
        `http://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('with custom cname cldAssetData and secure cldAssetData set to false', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, secure: false, cname: 'example.com' },
      });
      expect(url).toBe(
        `http://example.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('for private_cdn option set to true and secure option set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          secure: true,
          privateCdn: true,
        },
      });
      expect(url).toBe(
        `https://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('for private_cdn cldAssetData set to true and secure option set to true', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, privateCdn: true },
        options: {
          secure: true,
        },
      });
      expect(url).toBe(
        `https://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('for private_cdn option set to true and secure option set to false', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        options: {
          secure: false,
          privateCdn: true,
        },
      });
      expect(url).toBe(
        `http://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('for private_cdn and secure in both cldAssetData and options', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: { ...cldAssetData, privateCdn: false, secure: true },
        options: {
          secure: false,
          privateCdn: true,
        },
      });
      expect(url).toBe(
        `http://cloud-name-res.cloudinary.com/image/upload/f_jpg,h_600,w_400/public-id?_a=${ANALYTICS_CODE}`
      );
    });

    it('generates correct Cloudinary url in traced SVG mode', () => {
      const url = generateCloudinaryAssetUrl({
        height: 600,
        width: 400,
        format: 'jpg',
        cldAssetData: cldAssetData,
        tracedSvg: {
          options: {
            colors: 2,
            detail: 0.3,
            despeckle: 0.1,
          },
          width: 300,
        },
      });
      expect(url).toBe(
        `http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/e_vectorize:colors:2:detail:0.3:despeckle:0.1,w_300/public-id?_a=${ANALYTICS_CODE}`
      );
    });
  });
});
