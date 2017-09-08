import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
// import { LinearGradient } from 'tuya-rnkit';
// import { Rect } from 'react-native-svg';
import _ from 'lodash';
import ScalePickerItem from './ScalePickerItem';

const FRICTION_LEVEL = 0.3;

const VISIBLE_SCALE_WIDTH = 189;

const VISIBLE_SCALE_HEIGHT = 32;

const SCALE_PICKER_WIDTH = 27;

export default class ScalePicker extends Component {
  static defaultProps = {
    onSliding: () => {},
    onComplete: () => {},
    enabled: true,
    style: null,
  }

  static propTypes = {
    values: PropTypes.array.isRequired,
    selectedValue: PropTypes.number.isRequired,
    onSliding: PropTypes.func,
    onComplete: PropTypes.func,
    enabled: PropTypes.bool.isRequired,
    style: ViewPropTypes.style,
  }

  constructor(props) {
    super(props);

    const { values, selectedValue } = props;

    const scaleWidth = values.length * SCALE_PICKER_WIDTH;

    const bound = (scaleWidth - VISIBLE_SCALE_WIDTH) / 2;

    // 中位数
    this._median = Math.floor(values.length / 2);

    // x轴左右边界坐标
    // 左右两边留白允许边界Scale居中
    this._bounds = [bound + SCALE_PICKER_WIDTH * 3, -bound - SCALE_PICKER_WIDTH * 3];

    // 左右边界最小最大值
    this._boundsValue = [values[0], values[values.length - 1]];

    // 是否滑动超出左右边界
    this._outOfBounds = false;

    // 当前x坐标位移增量
    this._currDeltaX = this.calcDeltaX(selectedValue);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handleResponderGrant,
      onPanResponderMove: this._handleResponderMove,
      onPanResponderRelease: this._handleResponderRelease,
    });

    this.state = {
      deltaX: new Animated.Value(this._currDeltaX),
      selectedValue: props.selectedValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.selectedValue) {
      const deltaX = this.calcDeltaX(nextProps.selectedValue);
      this._currDeltaX = deltaX;
      this.state.deltaX.setValue(deltaX);
    }
  }

  calcDeltaX(selectedValue) {
    return (this._median - selectedValue) * SCALE_PICKER_WIDTH;
  }

  /**
   * @description 根据当前x轴偏移量计算当前所处位置的状态
   * 
   * @param {number} currDeltaX - 当前位置偏移量{距离中位数}
   * 
   * @return {Object}
   * 
   *   status.value    - 当前位置所对应的`值`
   *   status.position - 当前位置所对应的`偏移量`
   */
  calcNearestStat(currDeltaX) {
    const status = {};

    if (this._outOfBounds) {
      status.value = currDeltaX > 0 ? this._boundsValue[0] : this._boundsValue[1];
      status.position = currDeltaX > 0 ? this._bounds[0] : this._bounds[1];
    } else {
      status.value = this._median - Math.round(currDeltaX / SCALE_PICKER_WIDTH);
      status.position = Math.round(currDeltaX / SCALE_PICKER_WIDTH) * SCALE_PICKER_WIDTH;
    }

    return status;
  }

  /**
   * @description 水平滑动处理
   * 
   * 往左滑动 && 超出左边界
   * 往右滑动 && 超出右边界:
   *   为超出范围的偏移值添加Friction;
   * 
   * 在可移动范围内:
   *   更新当前位置;
   * 
   * @return deltaX 移动到达的值
   */
  _moveTo(dx) {
    let deltaX = this._currDeltaX + dx;
    // out of bounds
    if (
      dx > 0 && deltaX >= this._bounds[0] ||
      dx < 0 && deltaX <= this._bounds[1]
    ) {
      if (dx > 0) {
        // console.log('out of left bound');
        deltaX = this._bounds[0] + (deltaX - this._bounds[0]) * FRICTION_LEVEL;
      } else {
        // console.log('out of right bound');
        deltaX = this._bounds[1] + (deltaX - this._bounds[1]) * FRICTION_LEVEL;
      }
      this._outOfBounds = true;
    }
    this.state.deltaX.setValue(deltaX);
    return deltaX;
  }

  _handleResponderGrant = () => {}

  /**
   * @description 水平滑动处理
   * 
   * (!enabled || 没有水平移动):
   *   return;
   * 
   * enabled:
   *   根据dx设置当前所处位置;
   */
  _handleResponderMove = (e, gestureState) => {
    const { dx } = gestureState;
    if (!this.props.enabled || dx === 0) {
      return;
    }

    const deltaX = this._moveTo(dx);

    if (this.props.onSliding) {
      const status = this.calcNearestStat(deltaX);
      this.props.onSliding(status.value);
    }

    // console.log('nearestStatus: ', status);
  }

  /**
   * @description
   * 
   * (!enabled || 没有水平移动): return;
   * 
   * enabled:
   *   超出左右边界: 弹向左右边界;
   *   未超出边界: 弹向最接近的刻度;
   */
  _handleResponderRelease = (e, gestureState) => {
    const { dx } = gestureState;
    if (!this.props.enabled || dx === 0) {
      return;
    }

    const deltaX = this._moveTo(dx);
    const status = this.calcNearestStat(deltaX);

    if (this._outOfBounds) {
      // dx > 0 向左滑动
      this._currDeltaX = status.position;
      this._outOfBounds = false;
      this._bounceBackAnimation(status);
    } else {
      this._currDeltaX = status.position;
      this._bounceBackAnimation(status);
    }
  }

  _bounceBackAnimation(status) {
    this.state.deltaX.stopAnimation();
    Animated.spring(
      this.state.deltaX,
      { toValue: status.position },
    ).start();

    this.setState({ selectedValue: status.value });

    if (this.props.onComplete) {
      this.props.onComplete(status.value);
    }
  }

  render() {
    const { style, values } = this.props;
    // const stops = {
    //   '0%': 'rgba(255, 255, 255, 0)',
    //   '50%': 'rgba(255, 255, 255, 0.5)',
    //   '100%': 'rgba(255, 255, 255, 0)',
    // };
    return (
      <View style={[styles.container, style]}>

        {/* ScaleWrapper */}
        <View
          style={[styles.scaleWrapper]}
          {...this._panResponder.panHandlers}
        >

          <Animated.View
            style={[
              styles.scale,
              {
                transform: [{
                  translateX: this.state.deltaX,
                }],
              },
            ]}
          >
            {
              _.map(values, (value) => { // eslint-disable-line arrow-body-style
                /* const offset = Math.abs(this.state.selectedValue - value);
                const lineStyle = offset < 4 && {
                  opacity: 1 - offset * 0.25,
                };
                const mainLineStyle = offset < 4 && {
                  opacity: 1 - offset * 0.25,
                  width: this.state.selectedValue === value ? 2 : 1,
                  backgroundColor: this.state.selectedValue === value ? '#F5D000' : '#fff',
                }; */
                /* const mainLineStyle = this.state.selectedValue === value && {
                  width: 2,
                  backgroundColor: '#F5D000',
                  opacity: 1,
                }; */
                return (
                  <ScalePickerItem
                    key={value}
                    value={value}
                    selectedValue={this.state.selectedValue}
                  />
                );
              })
            }
          </Animated.View>

          {/* 固定指针 */}
          <View style={styles.axis}>
            <View style={[styles.line, styles.line__axis]} />
          </View>

        </View>

        {/* 遮罩 */}
        {/* <View style={styles.gradient}>
          <LinearGradient
            stops={stops}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Rect x="0" y="0" width={VISIBLE_SCALE_WIDTH} height={VISIBLE_SCALE_HEIGHT} />
          </LinearGradient>
        </View> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  // gradient: {
  //   position: 'absolute',
  //   left: 0,
  //   top: 0,
  //   width: VISIBLE_SCALE_WIDTH,
  //   height: VISIBLE_SCALE_HEIGHT,
  // },

  scaleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: VISIBLE_SCALE_WIDTH,
    height: VISIBLE_SCALE_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  scale: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  line: {
    width: 1,
    height: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 0.5,
  },

  axis: {
    flexDirection: 'row',
    position: 'absolute',
    left: (VISIBLE_SCALE_WIDTH - 28) / 2,
    top: 0,
    width: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  line__axis: {
    width: 2,
    height: VISIBLE_SCALE_HEIGHT,
    backgroundColor: '#F5D000',
    borderRadius: 1,
  },
});
