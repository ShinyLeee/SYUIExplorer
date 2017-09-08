import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import resp, { convert } from '../utils/responsive';

const SWITCH_WIDTH = convert(152);

const THUMB_SIZE = convert(48);

const THUMB_MARGIN = 2;

const SWIPE_THRESHOLD = 0.5;

export default class SwitchButton extends Component {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onValueChange: PropTypes.func,
    style: ViewPropTypes.style,
    thumbStyle: ViewPropTypes.style,
  }

  static defaultProps = {
    value: false,
    disabled: false,
    onValueChange: () => {},
    style: {},
    thumbStyle: {},
  }

  constructor(props) {
    super(props);
    this._isTouchMoved = false;
    this._isTouchReleased = false;
    this._fixedPosition = [0, SWITCH_WIDTH - THUMB_SIZE - (THUMB_MARGIN * 2)];
    this.state = {
      animating: false,
      switchOn: props.value,
      deltaX: new Animated.Value(props.value ? 1 : 0),
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.switchOn !== nextProps.value) {
      this.startMovingAnimation(nextProps.value, false);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.animating !== nextState.animating ||
    this.state.switchOn !== nextState.switchOn ||
    this.props.disabled !== nextProps.disabled;
  }

  get isBtnDisabled() {
    return this.props.disabled || this.state.animating;
  }

  _handleOpenSwitch = () => {
    if (!this.state.switchOn) {
      this.startMovingAnimation(true);
    }
  }

  _handleCloseSwitch = () => {
    if (this.state.switchOn) {
      this.startMovingAnimation(false);
    }
  }

  _handlePanResponderGrant = () => {}

  /**
   * @description thumb水平滑动处理：
   * 
   * 开启状态下: (thumb位于右侧)
   *   往左滑动在手动可拖拽范围内  -- setValue
   *   往左滑动超出手动可拖拽范围  -- 触发向反方向的滑动动画
   *   向右滑动并超出临界值       -- 触发向反方向的滑动动画
   * 
   * 关闭状态下: (thumb位于左侧)
   *   往右滑动在手动可拖拽范围内  -- setValue
   *   往右滑动超出手动可拖拽范围  -- 触发向反方向的滑动动画
   *   向左滑动并超出临界值       -- 触发向反方向的滑动动画
   */
  _handlePanResponderMove = (e, gestureState) => {
    if (this.isBtnDisabled || this._isTouchReleased) {
      return;
    }

    const { switchOn } = this.state;
    const { dx } = gestureState;
    const ratio = dx / this._fixedPosition[1];
    if (switchOn) {
      if (ratio < 0 && ratio > -SWIPE_THRESHOLD) {
        this._isTouchMoved = true;
        this.state.deltaX.setValue(1 - Math.abs(ratio));
      } else if (ratio <= -SWIPE_THRESHOLD || ratio >= SWIPE_THRESHOLD) {
        this._isTouchReleased = true;
        this.startMovingAnimation(!switchOn);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (ratio > 0 && ratio < SWIPE_THRESHOLD) {
        this._isTouchMoved = true;
        this.state.deltaX.setValue(ratio);
      } else if (ratio >= SWIPE_THRESHOLD || ratio <= -SWIPE_THRESHOLD) {
        this._isTouchReleased = true;
        this.startMovingAnimation(!switchOn);
      }
    }
  }

  /**
   * @description
   * 
   * 水平移动过但未超过可拖拽范围(touchmove)  --  触发弹回原方向滑动动画
   * 未水平移动(press|longPress)           --  触发向反方向的滑动动画
   * 
   */
  _handlePanResponderEnd = () => {
    const { switchOn } = this.state;
    if (this.isBtnDisabled || this._isTouchReleased) {
      this._isTouchMoved = false;
      this._isTouchReleased = false;
      return;
    }

    if (this._isTouchMoved) {
      this.startMovingAnimation(switchOn);
    } else {
      this.startMovingAnimation(!switchOn);
    }

    this._isTouchMoved = false;
    this._isTouchReleased = false;
  }

  startMovingAnimation(nextValue, isManual = true) {
    this.state.deltaX.stopAnimation();
    this.setState({
      animating: true,
    }, () => {
      Animated.spring(
        this.state.deltaX,
        { toValue: nextValue ? 1 : 0 },
      ).start(() => {
        this.setState({
          switchOn: nextValue,
          animating: false,
        });
        // onValueChange只会在手动触发时运行
        if (isManual && this.props.onValueChange) {
          this.props.onValueChange(nextValue);
        }
      });
    });
  }

  render() {
    const { style, thumbStyle } = this.props;
    return (
      <View style={[styles.container, style]}>

        {/* SwitchOn 提示 */}
        <TouchableWithoutFeedback
          disabled={this.isBtnDisabled}
          onPress={this._handleCloseSwitch}
        >
          <View style={[
            styles.textWrapper,
            this.state.switchOn && !this.state.animating && styles.visible,
          ]}
          >
            <Text style={styles.text}>On</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* SwitchOff 提示 */}
        <TouchableWithoutFeedback
          disabled={this.isBtnDisabled}
          onPress={this._handleOpenSwitch}
        >
          <View style={[
            styles.textWrapper,
            !this.state.switchOn && !this.state.animating && styles.visible,
          ]}
          >
            <Text style={styles.text}>Off</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* Thumb */}
        <Animated.Image
          {...this._panResponder.panHandlers}
          fadeDuration={0}
          resizeMode="contain"
          source={this.state.switchOn ? Assets.switch_on : Assets.switch_off}
          style={[
            styles.thumb,
            thumbStyle,
            this.isBtnDisabled && { opacity: 0.6 },
            {
              transform: [{
                translateX: this.state.deltaX.interpolate({
                  inputRange: [0, 1],
                  outputRange: this._fixedPosition,
                }),
              }],
            },
          ]}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SWITCH_WIDTH,
    height: convert(52),
    paddingHorizontal: convert(32),
    backgroundColor: '#d4d4d4',
    borderRadius: convert(100),
  },

  thumb: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    margin: 2,
    backgroundColor: 'transparent',
    opacity: 1,
  },

  textWrapper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0,
  },

  text: {
    fontSize: resp.FONT_SIZE_SMALL,
    color: '#666',
  },

  visible: {
    opacity: 1,
  },
});
