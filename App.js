import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { App } from './app/App';

console.info(App);

export default class Root extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
