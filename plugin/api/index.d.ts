export function getFixedImageObject(
  args: GetFixedImageObjectArgs
): Promise<FixedImageObject>;

export function getFluidImageObject(
  args: GetFluidImageObjectArgs
): Promise<FluidImageObject>;

export interface GetFixedImageObjectArgs {
  base64Transformations?: string[];
  base64Width?: number;
  chained?: string[];
  cloudName: string;
  defaultBase64?: string;
  fieldsToSelect?: string[];
  defaultTracedSVG?: string;
  height?: number;
  ignoreDefaultBase64?: boolean;
  originalHeight: number;
  originalWidth: number;
  public_id: string;
  reporter?: Record<string, any>;
  transformations?: string[];
  version?: boolean;
  width?: number;
}

export interface FixedImageObject {
  height?: number;
  src: string;
  srcSet?: string;
  tracedSVG?: string;
  width?: number;
  base64?: string | undefined;
}

export interface GetFluidImageObjectArgs
  extends Omit<GetFixedImageObjectArgs, 'height' | 'width'> {
  breakpoints?: number[];
  maxWidth?: number;
}

export interface FluidImageObject
  extends Omit<FixedImageObject, 'height' | 'width'> {
  aspectRatio?: number;
  presentationWidth?: number;
  presentationHeight?: number;
  sizes?: string;
}
