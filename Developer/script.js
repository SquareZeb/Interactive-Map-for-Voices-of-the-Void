var map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    minZoom: 0,
    maxZoom: 5,
    zoomControl: false,
    zoomAnimation: true,
    zoomAnimationThreshold: 0,
    wheelPxPerZoomLevel: 240,
});
var SouthWest = L.latLng(-200, -200);
var NorthEast = L.latLng(200, 200);
var MapBounds = L.latLngBounds(SouthWest, NorthEast);
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);
L.tileLayer('Images/Tiles/{z}/{x}_{y}.webp', {
    maxZoom: 5,
    attribution: '<img src="Images/Icons/Other/Promo.webp" alt="Icon" style="width:20px; height:20px;"><span style="font-size: 20px;">Created by: </span><a style="font-size: 20px; font-weight: bold; background-color: #007bff;" href="https://discordapp.com/users/813250158384906260"><span style="color: lawngreen;">Square</span><span style="color: aqua;">Zeb</span></a><br>Credits to <a style="font-weight: bold;" href="https://discordapp.com/users/1169983356440690779">somemonkeydude</a> on Discord for the base map.',
    noWrap: true,
    bounds: MapBounds
}).addTo(map);
map.setMaxBounds(MapBounds);
var coordinatesDiv = document.getElementById('coordinates');
var CustomCoordinateSystem = {
    origin: L.latLng(-0.4834, 0.835),
    topScaleFactor: 4.229897025469942,
    bottomScaleFactor: 4.13022219769709,
    yLogFactor: 0.017515,
    leftScaleFactor: 4,
    rightScaleFactor: 4.045946929314128,
    latLngToCustom: function(latlng) {
        var x = latlng.lng - this.origin.lng;
        var y = this.origin.lat - latlng.lat;
        if (y > 0) {
            y *= Math.pow(this.topScaleFactor, this.yLogFactor * Math.abs(y));
        } else {
            y *= Math.pow(this.bottomScaleFactor, this.yLogFactor * Math.abs(y));
        }
        if (x < 0) {
            x *= this.leftScaleFactor;
        } else {
            x *= this.rightScaleFactor;
        }
        x: (-1 * x);
        y: (-1 * y);
        return {
            x: x,
            y: y
        };
    },
    customToLatLng: function(coord) {
        var lat = this.origin.lat - coord.y;
        var lng = coord.x + this.origin.lng;
        if (coord.y > 0) {
            lat /= Math.pow(this.topScaleFactor, this.yLogFactor * Math.abs(coord.y));
        } else {
            lat /= Math.pow(this.bottomScaleFactor, this.yLogFactor * Math.abs(coord.y));
        }
        if (coord.x < 0) {
            lng /= this.leftScaleFactor;
        } else {
            lng /= this.rightScaleFactor;
        }
        return L.latLng(lat, lng);
    }
};
map.on('mousemove', function(e) {
    var leafletCoords = e.latlng;
    var customCoords = CustomCoordinateSystem.latLngToCustom(leafletCoords);
    coordinatesDiv.innerHTML = `Coordinates [MIGHT BE INACCURATE]: (${leafletCoords.lat.toFixed(4)}, ${leafletCoords.lng.toFixed(4)})`;
});
map.on('contextmenu', function(e) {
    var leafletCoords = e.latlng;
    var coordsText = `{ lat: ${leafletCoords.lat.toFixed(4)}, lng: ${leafletCoords.lng.toFixed(4)}`;
    copyToClipboard(coordsText);
});
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(function(err) {
            console.error("Failed to copy text: ", err);
        });
    } else {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
        document.body.removeChild(textArea);
    }
}
var CustomBounds = L.latLngBounds(
    CustomCoordinateSystem.customToLatLng({ x: -800, y: -800 }),
    CustomCoordinateSystem.customToLatLng({ x: 800, y: 800 })  
);
function createCustomIcon(url, width, height, arrowRotation = 0, arrowHeight = 10, arrowWidth = 6, arrowColor = 'red') {
    return L.divIcon({
        className: 'custom-marker-container',
        html: `<div class="custom-marker" style="width: ${width}px; height: ${height}px;">
                    <img src="${url}" class="custom-marker-img" style="width: ${width}px; height: ${height}px;">
                    <div class="marker-tooltip" style="
                        top: ${height}px; 
                        left: ${width / 2 - arrowWidth}px;
                        border-top: ${arrowHeight}px solid ${arrowColor};
                        transform: rotate(${arrowRotation}deg);
                    "></div>
                </div>`,
        iconSize: [width, height + arrowHeight],
        iconAnchor: [width / 2, height + arrowHeight],
        popupAnchor: [0, -(height + arrowHeight)]
    });
}
var markerTypes = {
    'Burger': 'Images/Icons/MapMarkers/0.webp',
    'Tile': 'Images/Icons/MapMarkers/1.webp',
    'Skull': 'Images/Icons/MapMarkers/2.webp',
    'Satellite': 'Images/Icons/MapMarkers/3.webp',
    'Argemia': 'Images/Icons/MapMarkers/5.webp',
    'Diggable': 'Images/Icons/MapMarkers/6.webp',
    'Landmark': 'Images/Icons/MapMarkers/7.webp',
    'Gameplay': 'Images/Icons/MapMarkers/8.webp',
    'Other': 'Images/Icons/MapMarkers/9.webp',
    'EMFSpot': 'Images/Icons/MapMarkers/10.webp',
    'Pumpkin': 'Images/Icons/MapMarkers/12.webp',
    'Note': 'Images/Icons/MapMarkers/13.webp'
};
var customMarkerLayers = {};
Object.keys(markerTypes).forEach(function(type) {
    customMarkerLayers[type] = L.featureGroup().addTo(map);
});
var markersData = [
    { lat: -3.2063, lng: -14.7656, title: 'Burger (X: -63, Y: 12)<br>Located under the bridge.', type: 'Burger'},
    { lat: -0.2197, lng: -2.3730, title: 'Burger (X: -12, Y: 0)<br>Located on the toilet.', type: 'Burger' },
    { lat: -7.1227, lng: -0.5273, title: 'Burger (X: -8, Y: 27)<br>Located on top of a server.', type: 'Burger' },
    { lat: -1.7795, lng: -2.4829, title: 'Burger (X: 14, Y: 8)<br>Located inside of an oven.', type: 'Burger' },
    { lat: -3.0528, lng: -3.0322, title: 'Burger (X: -14, Y: 9)<br>Located in a corner on the roof.', type: 'Burger' },
    { lat: -6.9046, lng: -4.3066, title: 'Burger (X: -20, Y: 27)<br>Located behind stairs.', type: 'Burger' },
    { lat: -7.2099, lng: 0.1758, title: 'Burger (X: -2, Y: 27)<br>Located on top of the vent cover.', type: 'Burger' },
    { lat: 80.5969, lng: 38.6279, title: 'Burger (X: 157, Y: -584)<br>(Requires: Shovel, Metal Detector) Dig in that specific spot.', type: 'Burger' },
    { lat: 81.0043, lng: -161.0376, title: 'Burger (X: -651, Y: -587)<br>Located in the AB Cave entrance.', type: 'Burger' },
    { lat: 7.2317, lng: -154.5557, title: 'Burger (X: -622, Y: -25)<br>Located under the generator in The Hole.', type: 'Burger' },
    { lat: -10.3582, lng: 158.0713, title: 'Burger (X: 639, Y: 44)<br>Next to the Ship Engine.', type: 'Burger' },
    { lat: -45.0270, lng: -23.2031, title: 'Burger (X: -100, Y: 203)<br>Located on the side of Juliett Satellite Dishs first level.', type: 'Burger' },
    { lat: -1.7795, lng: -1.9336, title: 'Burger (X: -10, Y: 6)<br>Located on top of the globe.', type: 'Burger' },
    { lat: 2.7894, lng: 11.5356, title: 'Burger (X: 42, Y: -12)<br>Located in the middle of grass.', type: 'Burger' },
    { lat: 7.8416, lng: 5.4272, title: 'Burger (X: 21, Y: -29)<br>Located on top of one of the Radio Poles on top of the Radio Tower.', type: 'Burger' },
    { lat: -49.7813, lng: -136.4941, title: 'Burger (X: -549, Y: 234)<br>Located on the roof of TR-1 however it is wedged in between the vent and the wall near a little star drawing.', type: 'Burger' },
    { lat: 80.7958, lng: -168.3984, title: 'Burger (X: -683, Y: -581)<br>Located further up in AB Cave, next to a pumpkin.', type: 'Burger' },
    { lat: -78.7335, lng: 53.0200, title: 'Burger (X: 215, Y: 541)<br>Located on top of a Stonehenge block piece.', type: 'Burger' },
    { lat: 46.4530, lng: 128.6499, title: 'Burger (X: 518, Y: -213)<br>Located on top of some supply boxes.', type: 'Burger' },
    { lat: -5.5285, lng: 100.5469, title: 'Burger (X: 405, Y: 24)<br>Located near the Wooded Shack.', type: 'Burger' },
    { lat: 64.1298, lng: 86.3306, title: 'Burger (X: 349, Y: -344)<br>Located under some rocks in a log.', type: 'Burger' },
    { lat: 83.6673, lng: 166.3770, title: 'Abandoned Church (X: 662, Y: -654)<br>Object', type: 'Landmark' },
    { lat: 8.4072, lng: -137.2852, title: 'Abandoned Housing (X: -553, Y: -56)<br>Object', type: 'Landmark' },
    { lat: 70.9740, lng: 100.9424, title: 'Flesh Pit (X: 410, Y: -416)<br>Object', type: 'Landmark' },
];
markersData.forEach(function(marker) {
    var customIcon = createCustomIcon(markerTypes[marker.type], 30, 30);
    if (marker.type === 'Satellite') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 70, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Burger') {
        customIcon = createCustomIcon(markerTypes[marker.type], 30, 25, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Argemia') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 70, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Diggable') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 70, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Tile') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Skull') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Landmark') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Gameplay') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'EMFSpot') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Pumpkin') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Other') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    if (marker.type === 'Note') {
        customIcon = createCustomIcon(markerTypes[marker.type], 46, 46, marker.arrowRotation, marker.arrowHeight, marker.arrowWidth, marker.arrowColor);
    }
    L.marker([marker.lat, marker.lng], { icon: customIcon })
        .bindPopup(marker.title, { className: 'custom-popup' })
        .addTo(customMarkerLayers[marker.type]);
});
var customMarkersVisible = {};
Object.keys(markerTypes).forEach(function(type) {
    customMarkersVisible[type] = true;
});
function toggleCustomMarkers(type) {
    if (customMarkersVisible[type]) {
        map.removeLayer(customMarkerLayers[type]);
    } else {
        map.addLayer(customMarkerLayers[type]);
    }
    customMarkersVisible[type] = !customMarkersVisible[type];
}
var markerTogglesDiv = document.getElementById('markerToggles');
Object.keys(markerTypes).forEach(function(type) {
    var toggleDiv = document.createElement('div');
    toggleDiv.className = 'marker-toggle';
    var iconWidth = 46;
    var iconHeight = 46;
    if (type === 'Burger') {
        iconWidth = 46;
        iconHeight = 40;
    }
    if (type === 'Satellite') {
        iconWidth = 46;
        iconHeight = 70;
    }
    if (type === 'Argemia') {
        iconWidth = 46;
        iconHeight = 60;
    }
    if (type === 'Diggable') {
        iconWidth = 46;
        iconHeight = 70;
    }
    toggleDiv.innerHTML = `<img src="${markerTypes[type]}" alt="${type}" style="width: ${iconWidth}px; height: ${iconHeight}px;"><span>${type.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>`;
    toggleDiv.onclick = (function(type) {
        return function() {
            toggleCustomMarkers(type);
        };
    })(type);
    markerTogglesDiv.appendChild(toggleDiv);
});
var toggleButton = document.createElement('div');
toggleButton.id = 'toggleButton';
toggleButton.innerHTML = '&#x25B6;';
toggleButton.style.right = '9px';
document.body.appendChild(toggleButton);
var sidebar = document.querySelector('.sidebar');
sidebar.classList.add('collapsed');
toggleButton.onclick = function() {
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        toggleButton.innerHTML = '&#x25C0;';
        toggleButton.style.right = '230px';
    } else {
        sidebar.classList.add('collapsed');
        toggleButton.innerHTML = '&#x25B6;';
        toggleButton.style.right = '9px';
    }
};
