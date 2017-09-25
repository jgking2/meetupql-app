import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const AppHeader = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>BoomshakaPIZZA</Text>
            <Text style={styles.subTitle}>Where we love pizza, a lot.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        paddingTop: 25,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#ddd",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    title: {
        fontSize: 16
    },
    subTitle : {
        fontSize: 10
    }
})