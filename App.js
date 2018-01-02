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

// padding used in fitToCoordinates.
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

// controls the level of zoom when zoom in/out buttons are pressed.
const ZOOM_FACTOR = 2/3;

// the total number of markers to use from the dataset (of ~ 14000)
const NUM_MARKERS = 400;

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
            markers: TorontoData.slice(0, NUM_MARKERS),
            visibleMarkers: [],
            zoomLevel: 0
        }

        this.map = null;
    }

    onLoad() {
        if (!this.state.loaded && this.map) {
            this.setState({loaded: true});
            this.map.fitToCoordinates(this.state.markers, {
                edgePadding: DEFAULT_PADDING,
                animated: false,
            });
            this.setVisibleMarkersAndZoomLevel();
        }
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    onRegionChangeComplete(region) {
        this.setState({ region }, () => {
            this.setVisibleMarkersAndZoomLevel();
        });
    }

    // sets this.state.zoomLevel and this.state.visibleMarkers
    setVisibleMarkersAndZoomLevel() {
        const zoomLevel = this.getZoomLevel();
        const visibleMarkers = this.state.markers.filter(
            marker => this.markerInZoomAndView(marker, this.state.region, zoomLevel)
        );
        this.setState({
            visibleMarkers: visibleMarkers,
            zoomLevel: zoomLevel
        });
    }

    markerInZoomAndView(marker, region, zoomLevel) {
        return (this.filterMarker(marker, zoomLevel) && this.markerInView(marker, region));
    }

    // returns true if the marker should be shown at this zoomLevel. in this implementation, the last 2 digits of the
    // submission ID determine at which zoom level a marker becomes visible. in prod, we will probably want to use the
    // marker's point value instead.
    filterMarker(marker, zoomLevel) {
       const submissionId = marker.submissionId;
       const last2Digits = +(submissionId.slice(-2));
       return (zoomLevel >= last2Digits);
    }

    // returns true if this marker is within the region's bounding box. because markers have a size, the region within
    // which it should be visible is slightly larger than the actual region visible on the map. thus a value greater
    // than 0.5 is used to calculate min and max lat and long. the value of 0.65 used here is arbitrary.
    markerInView(marker, region) {
        const maxLat = region.latitude + (0.65 * region.latitudeDelta);
        const minLat = region.latitude - (0.65 * region.latitudeDelta);
        const maxLong = region.longitude + (0.65 * region.longitudeDelta);
        const minLong = region.longitude - (0.65 * region.longitudeDelta);
        return (marker.latitude.between(maxLat, minLat) && marker.longitude.between(maxLong, minLong));
    }

    renderMarkers() {
        return this.state.visibleMarkers.map(function(marker, i) {
            return (
                <MapView.Marker
                    key={i.toString()}
                    coordinate={marker}
                />
            );
        });
    }

    // returns a value of [0,99] representing zoom level, with 99 being most zoomed in. in this implementation, the zoom
    // level has a quadratic relationship with the number of times the user taps the zoom in/out buttons. it is consumed
    // in filterMarkers in such a way that the proportion of visible markers increases by a factor of (-)X% each time
    // the user zooms in (or out).
    getZoomLevel() {
        let latitudeDelta = this.state.region.latitudeDelta;
        let i = 2 * (1 / latitudeDelta);
        if (i > 99) i = 99;
        if (i < 0) i = 0;
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
                    onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
                    onRegionChange={this.onRegionChange.bind(this)}
                    onLayout={this.onLoad.bind(this)}
                    style={styles.map}
                >
                    {this.renderMarkers()}
                </MapView>
                <ZoomControl map={this.map}
                             region={this.state.region}
                             callback={this.setVisibleMarkersAndZoomLevel.bind(this)}
                             zoomFactor={ZOOM_FACTOR}/>
                <Text style={styles.bottomLeftFloat}>
                    {this.state.zoomLevel}
                </Text>
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
    bottomLeftFloat: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 12
    },
});
