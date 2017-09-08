/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SectionList,
  Text,
  View,
} from 'react-native';
import SearchBar from './components/SearchBar';
import ListItem from './components/ListItem';
import configs from '../../configs';

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: configs.routes,
    };
    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleItemPress = this._handleItemPress.bind(this);
  }

  _handleTextChange() {
    // TODO
  }

  _handleItemPress(e, id) {
    const { navigate } = this.props.navigation;
    navigate(id);
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar onTextChange={this._handleTextChange} />
        <SectionList
          keyExtractor={item => item.id}
          sections={this.state.sections}
          renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              desc={item.desc}
              onItemPress={e => this._handleItemPress(e, item.id)}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    padding: 10,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
  },
});
