import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ViewPropTypes,
  PanResponder,
} from 'react-native';

const vwDimension = Dimensions.get('window');

export default class SwipeableListItem extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.any.isRequired,
    isLast: PropTypes.bool.isRequired,
    leftIconStyle: ViewPropTypes.style,
    leftIcon: PropTypes.number,
  }

  static defaultProps = {
    leftIconStyle: null,
    style: null,
    isLast: false,
    leftIcon: null,
  }

  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log('grant');
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        console.log('move', dx, dy);

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt, gestureState) => {
        console.log('release');
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
    });
  }

  render() {
    const {
      style,
      children,
      isLast,
      leftIconStyle,
      leftIcon,
    } = this.props;
    return (
      <View
        style={[styles.container, style, isLast && { borderBottomWidth: 0 }]}
        {...this._panResponder.panHandlers}
      >
        <Animated.View>
          {leftIcon && <Image source={leftIcon} style={[styles.leftIcon, leftIconStyle]} />}
        </Animated.View>
        <Animated.View>
          {React.cloneElement(children, { style: styles.children })}
        </Animated.View>
      </View>
    );
  }
}

const MARGIN_LEFT = 24;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: vwDimension.width - MARGIN_LEFT,
    height: 64,
    marginLeft: MARGIN_LEFT,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#999',
  },

  leftIcon: {
    position: 'absolute',
    left: 0,
    width: 24,
    height: 24,
    padding: 2,
  },

  children: {
    // width: vwDimension.width,
    // marginLeft: 24,
    // padding: 6,
  },
});
