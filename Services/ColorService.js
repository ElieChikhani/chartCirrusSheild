
export default class ColorService {
    static isLightColor(color){
      // Parse the color to RGB and calculate luminance
      const rgb = color.match(/\d+/g); // Assuming input like "rgb(255, 255, 255)"
      const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      return luminance > 186; // A commonly used threshold for contrast
    }
}