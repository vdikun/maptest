/* @flow */
/**
 * This component implements a simple zoom control which consists of rounded buttons containing a + and - respectively
 * which are displayed overlaying the bottom right hand corner of the parent element. The optional callback prop allows
 * the component to update its parent where necessary.
 */

import React, { Component, Element } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

// arbitrary value. larger value = slower animation.
const ANIMATE_TIME = 400;

class ZoomControl extends Component {
    zoom(factor: Number) {
        let newRegion = this.props.region;
        newRegion.latitudeDelta = newRegion.latitudeDelta * factor;
        newRegion.longitudeDelta = newRegion.longitudeDelta * factor;
        this.props.map.animateToRegion(newRegion, ANIMATE_TIME);
        if (this.props.callback) {
            this.props.callback(newRegion);
        }
    }

    render(): Element {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.zoom(this.props.zoomFactor);
                                  }}>
                    <Text>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={() => {
                                      this.zoom(1/this.props.zoomFactor);
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