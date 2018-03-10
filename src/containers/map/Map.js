import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import Message from '../message/Message';
import queryString from 'query-string';

class Map extends Component {

    state = {
        locationLoading: false,
        locationFound: false,
        messageText: ''
    }

    _markers = []

    componentDidUpdate(prevProps, prevState) {
        if (this.state.mapIsReady) {

            if (prevState.messageText !== this.state.messageText) {
                return
            }

            if (prevProps.isSidebarExpanded !== this.props.isSidebarExpanded) {
                this.handleMapResize()
            }

            // if query clear and user not founded
            if (!this.state.locationFound && !this.props.location.search) {
                this.setLocationByGeo()
            }

            //if have NEW changed query comes from props
            if (prevProps.location.search !== this.props.location.search) {

                const prev = queryString.parse(prevProps.location.search);
                const next = queryString.parse(this.props.location.search);

                if (prev.lat !== next.lat || prev.lng !== next.lng) {
                    console.log('lat,lng load');
                    this.setMapPosition(next);
                    this.setMarkers(prev);
                }

                if (prev.type !== next.type) {
                    console.log('type load');
                    this.setMarkers(next);
                }

                if (prev.radius !== next.radius) {
                    console.log('radius load');
                    this.setMarkers(next)
                }

                if (prev.opened !== next.opened) {
                    console.log('opened load');
                    this.setMarkers(next)
                }

                if (prev.rating !== next.rating) {
                    console.log('rating load');
                    this.setMarkers(next)
                }
            }
        }
    }

    componentDidMount() {
        this.loadMap();

        if (this.props.location.search) {
            const props = queryString.parse(this.props.location.search);
            this.setMapPosition(props);
            this.setMarkers(props);
        }
    }

    render() {
        return (
            <div>
                <div className="map-container" ref="map">
                    loading...
                </div>
                <Message
                    text={this.state.messageText}
                />
            </div>
        )
    }

    loadMap() {
        const {google} = this.props;

        this._map = new google.maps.Map(this.refs.map);

        this.setState({mapIsReady: true})

        this.props.handleMapInstance(this._map);

        this.handleMapDragging()

    }

    handleMapResize() {
        const {google} = this.props;
        setTimeout(() => {
            google.maps.event.trigger(this._map, "resize");
        }, 225)
    }

    handleMapDragging() {
        const {google} = this.props;
        google.maps.event.addListener(this._map, 'dragend', () => {
            const idleListener = this._map.addListener('idle', () => {
                google.maps.event.removeListener(idleListener);
                let pos = {
                    lat: this._map.getCenter().lat(),
                    lng: this._map.getCenter().lng()
                }
                this.setLocationQuery(pos)
            });
        });
    }

    setLocationByGeo() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.setState({locationFound: true})
                this.setLocationQuery(userPosition)

            }, (err) => {
                if (!this.state.locationLoading) {
                    this.setState({locationFound: false})
                    this.setLocationByIp();
                }
            }, this.props.geoOptions);
        } else {
            if (!this.state.locationLoading) {
                this.setState({locationFound: false})
                this.setLocationByIp();
            }
        }
    }

    setLocationByIp() {
        this.setState({locationLoading: true})
        axios.get('https://geoip-db.com/json/')
            .then((response) => {
                let pos = {
                    lat: response.data.latitude,
                    lng: response.data.longitude
                };
                this.setLocationQuery(pos)

            })
            .catch((error) => {
                console.log(error);
            });
    }

    setLocationQuery(pos) {
        let qs = queryString.parse(this.props.location.search);
        qs.lat = pos.lat;
        qs.lng = pos.lng;
        qs = queryString.stringify(qs);

        this.props.history.push({search: qs});

    }

    setMapPosition(props) {
        const {lat, lng} = props
        const position = {
            lat: +lat,
            lng: +lng
        }
        this._map.setCenter(position);

        if (!this._map.getZoom()) {
            this._map.setZoom(12)
        }
    }

    setMarkers(props) {
        const {type, radius, opened, rating} = props
        const {google} = this.props;

        if (!this._service) {
            this._service = new google.maps.places.PlacesService(this._map);
        }

        this._service.nearbySearch({
            location: this._map.getCenter(),
            rankby: 'PROMINENCE',
            radius: +radius ? +radius : 3000,
            type: [type ? type : 'restaurant'],
            openNow: opened ? opened : ''
        }, (results, status) => {
            console.log('status is ' + status);
            if (status === google.maps.places.PlacesServiceStatus.OK) {

                if (this._markers.length > 0) {
                    this.hideMarkers()
                }

                if (rating) {
                    results = this.getSortedPlacesByRating(results, rating);
                }

                if (results.length > 0) {

                    this._bounds = new google.maps.LatLngBounds();

                    for (let i = 0; i < results.length; i++) {
                        this.setMarker(results[i])
                    }

                    this._map.fitBounds(this._bounds);
                    this.setState({messageText: false})
                } else {
                    this.setState({messageText: 'no results for your criterions'})
                }
            } else {
                this.hideMarkers();
                this.setState({messageText: 'no results found here'})
            }
        })

    }

    setMarker(place) {
        const {google} = this.props;

        console.log(place);

        const marker = new google.maps.Marker({
            map: this._map,
            position: place.geometry.location,
            icon: {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                scaledSize: new google.maps.Size(50, 50)
            }
        });

        const content = `
                    <p><b>Name:</b> ${place.name}</p>
                    <p><b>Type:</b> ${place.types.toString()}</p>`;

        const infoWindow = new google.maps.InfoWindow({
            content
        });

        google.maps.event.addListener(marker, 'click', () => {
            this._service.getDetails(place, (result, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    console.error(status);
                    return;
                }
                infoWindow.open(this._map, marker);
            });
        });

        this._bounds.extend(place.geometry.location);
        this._markers.push(marker)
    }

    hideMarkers() {
        for (let i = 0; i < this._markers.length; i++) {
            this._markers[i].setMap(null);
        }
    }

    getSortedPlacesByRating = (places, rating) => {
        let sortedPlaces = [];
        rating = rating.split(',').map(Number);

        for (let i = 0; i < places.length; i++) {
            if (rating.includes(Math.floor(places[i].rating))) {
                sortedPlaces.push(places[i])
            }
        }

        return sortedPlaces;
    }
}

Map.defaultProps = {
    geoOptions: {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
        enableHighAccuracy: true
    }
}

export default withRouter(Map)