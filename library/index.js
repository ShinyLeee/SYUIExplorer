/* eslint-disable global-require */

const SYUI = {
  get CircleList() { return require('./CircleList').default; },

  get Mask() { return require('./MaskView').default; },

  get ScalePicker() { return require('./ScalePicker').default; },

  get SwipeListItem() { return require('./SwipeListItem').default; },

  get SwitchButton() { return require('./SwitchButton').default; },
};

module.exports = SYUI;
