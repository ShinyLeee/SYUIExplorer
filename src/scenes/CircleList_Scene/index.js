/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withLayout } from '../../lib/hoc';

class CircleList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Work in progress...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default withLayout(CircleList);
