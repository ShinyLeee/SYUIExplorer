import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';

export default class Mask extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    duration: PropTypes.number,
    onRequestClose: PropTypes.func,
    style: ViewPropTypes.style,
    children: PropTypes.any,
  }

  static defaultProps = {
    visible: false,
    duration: 200,
    onRequestClose: false,
    style: null,
    children: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      fadeAnim: new Animated.Value(props.visible ? 1 : 0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible) {
      if (nextProps.visible) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible ||
    this.props.duration !== nextProps.duration ||
    this.props.style !== nextProps.style ||
    this.props.children !== nextProps.children;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.visible &&
      prevState.visible !== this.state.visible
    ) {
      this._startAnimation(true);
    }
  }

  show() {
    this.state.fadeAnim.stopAnimation();
    this.setState({ visible: true });
  }

  hide() {
    this.state.fadeAnim.stopAnimation();
    this._startAnimation(
      false,
      () => this.setState({ visible: false }),
    );
  }

  _startAnimation(visible, callback) {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: visible ? 1 : 0,
        duration: this.props.duration,
      },
    ).start(() => callback && callback());
  }

  _handlePress = () => {
    if (
      this.props.onRequestClose &&
      typeof this.props.onRequestClose === 'function'
    ) {
      this.props.onRequestClose(this.state.visible);
    }
  }

  render() {
    const { style, children } = this.props;
    return (
      this.state.visible && (
        <Animated.View
          style={[
            styles.container,
            style,
            { opacity: this.state.fadeAnim },
          ]}
        >
          <TouchableWithoutFeedback onPress={this._handlePress}>
            <View style={styles.mask}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
