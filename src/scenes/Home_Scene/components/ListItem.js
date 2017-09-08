import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const ListItem = ({ title, desc, onItemPress }) => (
  <TouchableWithoutFeedback onPress={onItemPress}>
    <View style={styles.container}>
      <Text style={styles.title}>{`<${title} />`}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </TouchableWithoutFeedback>
);

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#9a9a9a',
    paddingVertical: 12,
    paddingLeft: 6,
    paddingRight: 12,
    marginLeft: 16,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },

  desc: {
    fontSize: 14,
    color: '#9a9a9a',
  },
});

export default ListItem;
