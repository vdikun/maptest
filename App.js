/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
    Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import ZoomControl from './components/ZoomControl.js';

// SF.
const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default class App extends Component<{}> {
    constructor(props) {
        super(props);

        this.state = {
            region: initialRegion
        }

        this.map = null;
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    zoom(factor: Number) {
        const newRegion = this.state.region;
        newRegion.latitudeDelta = newRegion.latitudeDelta * factor;
        newRegion.longitudeDelta = newRegion.longitudeDelta * factor;
        this.setState({
            region: newRegion
        });
        this.map.animateToRegion(this.state.region, 400);
    }

    render() {
        const that = this;
        return (
            <View style={styles.container}>
                <MapView
                    onRegionChangeComplete={this.onRegionChange.bind(this)}
                    initialRegion={initialRegion}
                    style={styles.map}
                    ref={ (ref) => {
                        that.map = ref;
                    }}
                />
                <ZoomControl zoom={this.zoom.bind(this)}/>
            </View>
        );
    }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
      flex: 1,
      width: width,
      height: height
  },
});
