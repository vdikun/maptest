/* @flow */

import React, { Component, Element } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

class ZoomControl extends Component {
    render(): Element {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.props.zoom(1.5);
                                  }}>
                    <Text>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.props.zoom(0.75);
                                  }}>
                    <Text>-</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0)',
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    button: {
        borderRadius: 15,
        margin: 5,
        borderWidth: 1,
        borderColor: '#bbbbbb',
        width: 30,
        height: 30,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ZoomControl;