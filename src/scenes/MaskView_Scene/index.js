import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Switch,
} from 'react-native';
import { Mask } from 'SYUI';
import { withLayout } from '../../lib/hoc';

const window = Dimensions.get('window');

class MaskView extends Component {
  state = {
    visible: false,
  }

  _handleMaskRequestClose = (value) => {
    this.setState({
      visible: !value,
    });
  }

  _handleToggleMask = () => {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Mask
            visible={this.state.visible}
            onRequestClose={this._handleMaskRequestClose}
          />
        </View>

        <View style={styles.footer}>
          <Switch
            value={this.state.visible}
            onValueChange={this._handleToggleMask}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    flex: 1,
    width: window.width,
  },

  footer: {
    width: window.width,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
});

export default withLayout(MaskView);
