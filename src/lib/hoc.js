/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const withLayout = (WrappedComponent) => {
  return class ComponentLayout extends Component {
    static propTypes = {
      navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.routeName,
    });

    constructor(props) {
      super(props);
      this.routeState = props.navigation.state;
    }

    render() {
      return (
        <View style={styles.container}>
          <Text>You are now in {this.routeState.routeName}</Text>
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
});
