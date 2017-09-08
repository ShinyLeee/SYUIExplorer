import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  // Text,
  // Image,
  StyleSheet,
} from 'react-native';
import { SwitchButton } from 'SYUI';
// import Assets from '../../assets';
import { withLayout } from '../../lib/hoc';
import resp from '../../utils/responsive';

class SwipeableListItemScene extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    // children: PropTypes.any.isRequired,
  }

  static defaultProps = {
    style: null,
  }

  state = {
    power: false,
    atomize: false,
  }

  _handleTogglePower = (value) => {
    this.setState({ power: value });
  }

  _handleToggleAtomize = (value) => {
    this.setState({ atomize: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <SwitchButton
          value={this.state.power}
          onValueChange={this._handleTogglePower}
        />
        <SwitchButton
          value={this.state.atomize}
          onValueChange={this._handleToggleAtomize}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: resp.DEVICE_WIDTH,
    height: 72,
    backgroundColor: '#eee',
  },

  textWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContent: {
    color: '#333',
    fontSize: 20,
  },

  textDesc: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
});

export default withLayout(SwipeableListItemScene);
