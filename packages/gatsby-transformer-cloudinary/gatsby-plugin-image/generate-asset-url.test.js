const { generateCloudinaryAssetUrl } = require('./generate-asset-url');

describe('generateCloudinaryAssetUrl', () => {
  const asset = {
    publicId: 'public-id',
    cloudName: 'cloud-name',
    width: 400,
    height: 600,
    format: 'jpg',
  };

  it('generates correct Cloudinary url when no options', () => {
    const url = generateCloudinaryAssetUrl(asset);
    expect(url).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/public-id'
    );
  });

  it('generates correct Cloudinary url with transformations option', () => {
    const url = generateCloudinaryAssetUrl({
      ...asset,
      options: {
        transformations: ['e_grayscale', 'e_pixelate'],
      },
    });
    expect(url).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400,e_grayscale,e_pixelate/public-id'
    );
  });

  it('generates correct Cloudinary url with chained option', () => {
    const url = generateCloudinaryAssetUrl({
      ...asset,
      options: {
        chained: ['t_lwj', 'e_pixelate'],
      },
    });
    expect(url).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/t_lwj/e_pixelate/public-id'
    );
  });

  it('generates correct Cloudinary url with sizing options', () => {
    const url = generateCloudinaryAssetUrl({
      ...asset,
      options: {
        x: 10,
        y: 15,
        crop: 'fill',
        zoom: 5,
        outputPixelDensities: 1.5,
        gravity: 'west',
      },
    });
    expect(url).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/c_fill,dpr_1.5,f_jpg,g_west,h_600,w_400,x_10,y_15,z_5/public-id'
    );
  });

  it('generates correct Cloudinary url with quality options', () => {
    const url = generateCloudinaryAssetUrl({
      ...asset,
      options: {
        quality: 'auto',
      },
    });
    expect(url).toBe(
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,q_auto,w_400/public-id'
    );
  });

  it('generates correct Cloudinary url in traced SVG mode', () => {
    const url = generateCloudinaryAssetUrl({
      ...asset,
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
      'http://res.cloudinary.com/cloud-name/image/upload/f_jpg,h_600,w_400/e_vectorize:colors:2:detail:0.3:despeckle:0.1,w_300/public-id'
    );
  });
});
