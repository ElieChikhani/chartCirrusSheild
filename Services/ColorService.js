
export default class ColorService {
    static isLightColor(color){
      // Parse the color to RGB and calculate luminance
      const rgb = color.match(/\d+/g); // Assuming input like "rgb(255, 255, 255)"
      const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      return luminance > 186; // A commonly used threshold for contrast
    }

    static getRGBColor(color) {
      if(color){
      if (color.startsWith('rgb')) {
          return color;
      } else if (color.startsWith('#')) {
          let hex = color.slice(1);

          // If short hex format, expand it
          if (hex.length === 3) {
              hex = hex.split('').map(char => char + char).join('');
          }

          // If hex includes alpha channel
          if (hex.length === 8) {
              hex = hex.slice(0, 6);
          }

          let r = parseInt(hex.slice(0, 2), 16);
          let g = parseInt(hex.slice(2, 4), 16);
          let b = parseInt(hex.slice(4, 6), 16);

          return `rgb(${r}, ${g}, ${b})`;
      }else{
      throw new Error("Invalid color format");
      }
    }

    }

    static changeOpacity(color, opacity) {

      if(color){
      if (opacity < 0 || opacity > 1) {
          throw new Error("Opacity must be between 0 and 1.");
      }

      color = this.getRGBColor(color);
      let rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      console.log(rgbMatch)

      if (rgbMatch) {
          let r = parseInt(rgbMatch[1], 10);
          let g = parseInt(rgbMatch[2], 10);
          let b = parseInt(rgbMatch[3], 10);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      throw new Error("Invalid color format");
    } 

  }

  }

