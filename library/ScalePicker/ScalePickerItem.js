import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';

export default class ScalePickerItem extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    lineStyle: ViewPropTypes.style,
    mainLineStyle: ViewPropTypes.style,
  }

  static defaultProps = {
    style: null,
    lineStyle: null,
    mainLineStyle: null,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.style !== nextProps.style ||
    this.props.mainLineStyle !== nextProps.mainLineStyle ||
    this.props.lineStyle !== nextProps.lineStyle;
  }

  render() {
    const {
      style,
      lineStyle,
      mainLineStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.line, lineStyle]} />
        <View
          style={[
            styles.line,
            styles.line__long,
            mainLineStyle,
          ]}
        />
        <View style={[styles.line, lineStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 27,
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  line: {
    width: 1,
    height: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 0.5,
    opacity: 0.4,
  },

  line__long: {
    height: 32,
  },
});
