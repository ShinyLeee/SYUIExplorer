import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { SwipeableListItem } from 'SYUI';
import { withLayout } from '../../lib/hoc';
import datas from './data';

const res = require('../../assets/common_selected.png');

class SwipeableListItemScene extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    // children: PropTypes.any.isRequired,
  }

  static defaultProps = {
    style: null,
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={res} resizeMode="contain" />
        {
          datas.map((data, i, arr) => (
            <SwipeableListItem
              key={data.id}
              leftIcon={res}
              isLast={i === arr.length - 1}
            >
              <View style={styles.textWrapper}>
                <Text style={styles.textContent}>{data.content}</Text>
                <Text style={styles.textDesc}>{data.desc}</Text>
              </View>
            </SwipeableListItem>
          ))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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
