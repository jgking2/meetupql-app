import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import PropTypes from 'prop-types';
const defaultText = 'Loading something magical...';

export const LoadingScreen = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text>{text || defaultText}</Text>
            <ActivityIndicator />
        </View>
    )
}

LoadingScreen.PropTypes = {
    text : PropTypes.string
};

const styles = StyleSheet.create({
    container : { 
        justifyContent : "center", 
        alignItems: "center"
    }
});