/* @flow */

import React, { Component, Element } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

class ZoomControl extends Component {
    zoom(factor: Number) {
        let newRegion = this.props.region;
        newRegion.latitudeDelta = newRegion.latitudeDelta * factor;
        newRegion.longitudeDelta = newRegion.longitudeDelta * factor;
        this.props.map.animateToRegion(newRegion, 400);
    }

    render(): Element {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.zoom(0.6);
                                  }}>
                    <Text>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.zoom(1.667);
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