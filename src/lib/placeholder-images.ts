// Imports placeholder image data from a local JSON file.
import data from './placeholder-images.json';

/**
 * Defines the shape of a placeholder image object.
 */
export type ImagePlaceholder = {
  /** A unique identifier for the image. */
  id: string;
  /** A description of the image. */
  description: string;
  /** The URL of the image. */
  imageUrl: string;
  /** A hint or keyword for the image. */
  imageHint: string;
};

/**
 * An array of placeholder image objects, loaded from the JSON file.
 * This is used to populate parts of the UI with placeholder content.
 */
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
