import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { ScalePicker } from 'SYUI';
// import Assets from '../../assets';
import resp from '../../utils/responsive';

const { DEVICE_WIDTH } = resp;

const speedValues = _.times(9, n => n); // 0 - 100

export default class ScalePickerScene extends Component {
  state = {
    value: 0,
  }

  _handlePickerComplete = (value) => {
    if (this.state.value !== value) {
      this.setState({ value });
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {/* 渐变背景 */}
        {/* <Image
          style={styles.gradient}
          source={Assets.gradient}
          resizeMode="stretch"
        /> */}

        {/* ScalePicker */}
        <View style={styles.content}>
          <ScalePicker
            values={speedValues}
            selectedValue={this.state.value}
            onComplete={this._handlePickerComplete}
          />
          <Text style={styles.text}>
            {`${this.state.value}%`}
          </Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -12,
    backgroundColor: '#3023AE',
  },

  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DEVICE_WIDTH,
    height: 88,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DEVICE_WIDTH,
    height: 88,
    paddingVertical: 12,
  },

  text: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
