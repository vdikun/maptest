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
import TorontoData from './assets/TorontoData.js';

// SF.
const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
};

export default class App extends Component<{}> {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            region: initialRegion,
            markers: TorontoData.slice(0, 105),
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

    onLoad() {
        if (!this.state.loaded && this.map) {
            this.setState({loaded: true});
            this.map.fitToCoordinates(this.state.markers, {
                edgePadding: DEFAULT_PADDING,
                animated: false,
            });
        }
    }

    markerInView(marker) {
        const region = this.state.region;
        const zoomLevel = this.getZoomLevel(region.latitudeDelta);
        if (this.filterMarker(marker, zoomLevel)) {
            const maxLat = region.latitude + (0.65 * region.latitudeDelta);
            const minLat = region.latitude - (0.65 * region.latitudeDelta);
            const maxLong = region.longitude + (0.65 * region.longitudeDelta);
            const minLong = region.longitude - (0.65 * region.longitudeDelta);
            return (marker.latitude.between(maxLat, minLat) && marker.longitude.between(maxLong, minLong))
        };
    }

    filterMarker(marker, zoomLevel) {
       const submissionId = marker.submissionId;
       const lastDigit = +(submissionId.split('').pop());
       return (zoomLevel >= lastDigit);
    }

    renderMarkers() {
        const that = this;
        return this.state.markers.map(function(marker, i) {
            if (that.markerInView(marker)) {
                return (
                    <MapView.Marker
                        key={i.toString()}
                        coordinate={marker}
                    />
                );
            }
        });
    }

    getZoomLevel(latitudeDelta) {
        let i = 2 * Math.log2(1 / latitudeDelta);
        if (i > 9) {
            i = 9;
        }
        if (i < 0) {
            i = 0;
        }
        i = Math.floor(i);
        return i;
    }

    render() {
        const that = this;
        return (
            <View style={styles.container}>
                <MapView
                    ref={ (ref) => {
                        if (ref) {
                            that.map = ref;
                        }
                    }}
                    onRegionChangeComplete={this.onRegionChange.bind(this)}
                    onRegionChange={this.onRegionChange.bind(this)}
                    onLayout={this.onLoad.bind(this)}
                    style={styles.map}
                >
                    {this.renderMarkers()}
                </MapView>
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
