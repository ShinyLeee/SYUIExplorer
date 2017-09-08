/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Proptypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const vwWidth = Dimensions.get('window').width;

export default class SearchBar extends Component {
  static propTypes = {
    onTextChange: Proptypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
    this._handleTextChange = this._handleTextChange.bind(this);
  }

  _handleTextChange(text) {
    this.setState({ text });
    this.props.onTextChange(text);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={this.state.text}
          placeholder="Search..."
          placeholderTextColor="#d9d9db"
          onChangeText={this._handleTextChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },

  textInput: {
    flex: 1,
    width: vwWidth - 24,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: StyleSheet.hairlineWidth,
    textAlign: 'center',
  },
});
