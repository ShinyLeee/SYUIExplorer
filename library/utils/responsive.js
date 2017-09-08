

import { Dimensions } from 'react-native';

// Precalculate Device Dimensions for better performance
const { width: x, height: y } = Dimensions.get('window');

const pivotWidth = 375;

const pivotHeight = 667;

const ratioX = x / pivotWidth;

const ratioY = y / pivotHeight;

// We set our base font size value
const BASE_UNIT = 16;

// We're simulating EM by changing font size according to Ratio
const unit = BASE_UNIT * ratioY;

const em = value => Math.round(unit * value);

export const convert = value => Math.floor(ratioY * value);

// 常用值
export default {

  // GENERAL
  DEVICE_WIDTH: x,
  DEVICE_HEIGHT: y,
  RATIO_X: ratioX,
  RATIO_Y: ratioY,
  UNIT: em(1),

  // FONT
  FONT_SIZE_NORMAL: em(1),     // 16 in iphone6
  FONT_SIZE_SMALL: em(0.85),   // 14 ... 
  FONT_SIZE_SMALLER: em(0.75), // 12 ...

};
