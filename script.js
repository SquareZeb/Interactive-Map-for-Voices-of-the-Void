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
    coordinatesDiv.innerHTML = `Coordinates: (${customCoords.x.toFixed(4)}, ${customCoords.y.toFixed(4)}) [MAY NOT BE ACCURATE]`;
});
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
    { lat: 7.8416, lng: 5.4272, title: 'Burger (X: 21, Y: -29)<br>Located on top of one of the Radio Poles on top of the Radio Tower.', type: 'Burger' },
    { lat: -49.7813, lng: -136.4941, title: 'Burger (X: -549, Y: 234)<br>Located on the roof of TR-1 however it is wedged in between the vent and the wall near a little star drawing.', type: 'Burger' },
    { lat: 80.7958, lng: -168.3984, title: 'Burger (X: -683, Y: -581)<br>Located further up in AB Cave, next to a pumpkin.', type: 'Burger' },
    { lat: -78.7335, lng: 53.0200, title: 'Burger (X: 215, Y: 541)<br>Located on top of a Stonehenge block piece.', type: 'Burger' },
    { lat: 46.4530, lng: 128.6499, title: 'Burger (X: 518, Y: -213)<br>Located on top of some supply boxes.', type: 'Burger' },
    { lat: -5.5285, lng: 100.5469, title: 'Burger (X: 405, Y: 24)<br>Located near the Wooded Shack.', type: 'Burger' },
    { lat: 64.1298, lng: 86.3306, title: 'Burger (X: 349, Y: -344)<br>Located under some rocks in a log.', type: 'Burger' },
    { lat: -0.6592, lng: -1.4941, title: 'Tile (X: -9, Y: 2)<br>Located on the secondary roof of the main base.', type: 'Tile' },
    { lat: -4.4340, lng: -16.6333, title: 'Tile (X: -68, Y: 16)<br>Located on the left side of a bridge near the main base.', type: 'Tile' },
    { lat: 7.0137, lng: -154.4238, title: 'Tile (X: -617, Y: -24)<br>Located underneath one of the supply boxes in The Hole.', type: 'Tile' },
    { lat: 12.8546, lng: -130.6934, title: 'Tile (X: -525, Y: -49)<br>Next to a tree base.', type: 'Tile' },
    { lat: -39.5210, lng: -111.9067, title: 'Tile (X: -464, Y: 173)<br>Located in the middle of a field.', type: 'Tile' },
    { lat: 1.0986, lng: 123.2886, title: 'Tile (X: 500, Y: -2)<br>Located behind the top level of the Uniform Satellite Dish.', type: 'Tile' },
    { lat: -81.9571, lng: 151.5894, title: 'Tile (X: 615, Y: 620)<br>Located next to Green Box.', type: 'Tile' },
    { lat: -84.4401, lng: -91.8677, title: 'Tile (X: -372, Y: 702)<br>Located above the building in Guard Post.', type: 'Tile' },
    { lat: 84.8104, lng: 177.3633, title: 'Tile (X: 874, Y: -874)<br>Located on the very corner of the playable map, two rivers corner.', type: 'Tile', arrowRotation: -135, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -79.1134, lng: 52.7344, title: 'Skull (X: 213, Y: 549)<br>Located offset of the center of the Stonehenge behind one layer of grass.', type: 'Skull' },
    { lat: -59.4786, lng: -141.0425, title: 'Skull (X: -569, Y: 302)<br>Located near a skeleton of bones and a radioactive capsule. In the Darkened Bone Pit.', type: 'Skull' },
    { lat: -10.0554, lng: -83.6719, title: 'Skull (X: -343, Y: 38)<br>Located near the Light Pit, it will be found outside the vicinity of the Light Bone Pit behind a couple bushes.', type: 'Skull' },
    { lat: 81.2081, lng: -160.9937, title: 'Skull (X: -655, Y: -600)<br>Located deep inside the AB Cave towards the cave barrier and on your left.', type: 'Skull' },
    { lat: -5.6379, lng: -2.7026, title: 'Skull (X: -7, Y: 12)<br>Located near one of the boxes in the Basement.', type: 'Skull' },
    { lat: -10.3582, lng: 157.6538, title: 'Skull (X: 637, Y: 44)<br>(Requires: Shovel, Metal Detector) Located underneath the Ship Engine,<br> you will need to trigger the Rozital Ship Event in order to access this skull.', type: 'Skull' },
    { lat: 1.9332, lng: 65.8301, title: 'Skull (X: 261, Y: -6)<br>(Requires: Shovel, Metal Detector) Located near a large boulder you will need to dig around it in order to access a box that has a skull in it.', type: 'Skull' },
    { lat: 76.5526, lng: -122.9150, title: 'Romeo (X: -500, Y: -500)<br>Satellite Dish', type: 'Satellite' },
    { lat: 59.5566, lng: -74.0039, title: 'November (X: -300, Y: -300)<br>Satellite Dish', type: 'Satellite' },
    { lat: 76.8858, lng: -0.1538, title: 'Sierra (X: 0, Y: -500)<br>Satellite Dish', type: 'Satellite' },
    { lat: 76.6189, lng: 124.8926, title: 'Tango (X: 500, Y: -500)<br>Satellite Dish', type: 'Satellite' },
    { lat: 0.2637, lng: -124.8047, title: 'Yankee (X: -500, Y: 0)<br>Satellite Dish', type: 'Satellite' },
    { lat: -76.7505, lng: -0.5273, title: 'Whiskey (X: 0, Y: 500)<br>Satellite Dish', type: 'Satellite' },
    { lat: -58.9273, lng: 73.5645, title: 'Papa (X: 300, Y: 300)<br>Satellite Dish', type: 'Satellite' },
    { lat: 58.9046, lng: 75.9814, title: 'Oscar (X: 300, Y: -300)<br>Satellite Dish', type: 'Satellite' },
    { lat: 0.4834, lng: 124.0137, title: 'Uniform (X: 500, Y: 0)<br>Satellite Dish', type: 'Satellite' },
    { lat: -76.6079, lng: 122.7450, title: 'Victor (X: 500, Y: 500)<br>Satellite Dish', type: 'Satellite' },
    { lat: -76.7606, lng: -123.9248, title: 'Xray (X: -500, Y: 500)<br>Satellite Dish', type: 'Satellite' },
    { lat: -59.3556, lng: -74.2676, title: 'Quebec (X: -300, Y: 300)<br>Satellite Dish', type: 'Satellite' },
    { lat: 1.0986, lng: 50.5811, title: 'Foxtrot (X: 200, Y: 0)<br>Satellite Dish', type: 'Satellite' },
    { lat: -43.8979, lng: -23.2251, title: 'Juliett(X: -100, Y: 200)<br>Satellite Dish', type: 'Satellite' },
    { lat: -44.0244, lng: 1.3184, title: 'India (X: 0, Y: 200)<br>Satellite Dish', type: 'Satellite' },
    { lat: -44.4024, lng: 24.6973, title: 'Hotel (X: 100, Y: 200)<br>Satellite Dish', type: 'Satellite' },
    { lat: 44.2137, lng: -24.3457, title: 'Bravo (X: -100, Y: -200)<br>Satellite Dish', type: 'Satellite' },
    { lat: 44.0876, lng: 0.3516, title: 'Charlie (X: 0, Y: -200)<br>Satellite Dish', type: 'Satellite' },
    { lat: -24.0465, lng: 50.0977, title: 'Golf (X: 200, Y: 100)<br>Satellite Dish', type: 'Satellite' },
    { lat: -1.4061, lng: -49.1309, title: 'Lima (X: -200, Y: 0)<br>Satellite Dish', type: 'Satellite' },
    { lat: 24.0465, lng: -49.3506, title: 'Mike (X: -200, Y: -100)<br>Satellite Dish', type: 'Satellite' },
    { lat: -25.2049, lng: -48.5156, title: 'Kilo (X: -200, Y: 100)<br>Satellite Dish', type: 'Satellite' },
    { lat: 43.7076, lng: 24.3896, title: 'Delta (X: 100, Y: -200)<br>Satellite Dish', type: 'Satellite' },
    { lat: 23.3914, lng: 49.6787, title: 'Echo (X: 200, Y: -100)<br>Satellite Dish', type: 'Satellite' },
    { lat: 30.2401, lng: 155.7642, title: 'Red Argemia (X: 626, Y: -128)<br>Located in the Deep Pit next to Uniform Satellite Dish, near the fence.', type: 'Argemia' },
    { lat: -70.0581, lng: -77.5195, title: 'Blue Argemia (X: -315, Y: 398)<br>Located right next to Quebec Satellite Dish, in a river with bumpy beaches.', type: 'Argemia' },
    { lat: -84.8342, lng: 76.0254, title: 'Green Argemia (X: 239, Y: 828)<br>Located on the highest point of the map, outside the fence, near Victor Satellite Dish.', type: 'Argemia', arrowRotation: 0, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -41.8205, lng: -156.6211, title: 'Cyan Argemia (X: -630, Y: 190)<br>(Requires: Shovel, Metal Detector) Located on top of a high hill between Quebec and X-ray Satellite Dishes.', type: 'Argemia' },
    { lat: 84.3543, lng: 177.6270, title: 'Orange Argemia (X: 872, Y: -793)<br>Located above the border corner tile key, on top of a floating invisible cube that is high up.<br> The only way to access this prop is getting on top of the cube and grabbing the prop.', type: 'Argemia', arrowRotation: -135, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: 8.4072, lng: 9.5801, title: 'Pink Argemia (X: 34.8, Y: -36.8)<br>Located in a hovering state, it is invisible (until it is touched by any object or item in the game),<br>fly a drone straight from these approximate coordinates until you bump into it.', type: 'Argemia' },
    { lat: 8.6462, lng: -153.1714, title: 'Diggable Spot (X: -622, Y: -31)<br>EMF Reader.', type: 'Diggable' },
    { lat: 10.1852, lng: -28.6084, title: 'Diggable Spot (X: -118, Y: -41)<br>Free Box of LVL 3 Drives.', type: 'Diggable' },
    { lat: 1.5818, lng: 65.7202, title: 'Diggable Spot (X: 261, Y: -6)<br>Box of Bones.', type: 'Diggable' },
    { lat: 2.4821, lng: 38.1226, title: 'Diggable Spot (X: 149, Y: -10)<br>Cactis Pet.', type: 'Diggable' },
    { lat: 21.9467, lng: 116.7111, title: 'Diggable Spot (X: 465, Y: -85)<br>Infinite Growing Basalt Pillars.', type: 'Diggable' },
    { lat: -59.6122, lng: -141.0645, title: 'Diggable Spot (X: -569, Y: 303)<br>Radioactive Capsule.', type: 'Diggable' },
    { lat: -49.4005, lng: 139.8950, title: 'Diggable Spot (X: 567, Y: 237)<br>Limestone Block.', type: 'Diggable' },
    { lat: -54.3037, lng: 104.6558, title: 'Diggable Spot (X: 420, Y: 265)<br>Wasp Nest.', type: 'Diggable' },
    { lat: 74.2955, lng: 94.4165, title: 'Diggable Spot (X: 378, Y: -461)<br>Librarians Candle', type: 'Diggable' },
    { lat: -80.6184, lng: 62.1387, title: 'Diggable Spot (X: 252, Y: 585)<br>Furfur Altar Piece', type: 'Diggable' },
    { lat: 75.4531, lng: 38.1445, title: 'Diggable Spot (X: 175, Y: -460)<br>Fishing Gear', type: 'Diggable' },
    { lat: 82.9051, lng: -160.1147, title: 'EMF Detected Spot (X: -645, Y: -645)', type: 'EMFSpot' },
    { lat: -49.8380, lng: 92.5049, title: 'EMF Detected Spot (X: 373, Y: 234)<br>', type: 'EMFSpot' },
    { lat: 64.5390, lng: 70.4883, title: 'EMF Detected Spot (X: -281, Y: -347)', type: 'EMFSpot' },
    { lat: -4.2448, lng: -1.3312, title: 'EMF Detected Spot (X: -7, Y: 6)', type: 'EMFSpot' },
    { lat: -1.8454, lng: -48.5156, title: 'EMF Detected Spot (X: -197, Y: 2)', type: 'EMFSpot' },
    { lat: -54.2524, lng: 139.5264, title: 'EMF Detected Spot (X: 564, Y: 265)', type: 'EMFSpot' },
    { lat: -4.9158, lng: 101.6675, title: 'EMF Detected Spot (X: 409, Y: 22)', type: 'EMFSpot' },
    { lat: 8.1462, lng: 4.7681, title: 'EMF Detected Spot (X: 19, Y: -31)', type: 'EMFSpot' },
    { lat: 83.6794, lng: 130.6055, title: 'EMF Detected Spot (X: 524, Y: -672)', type: 'EMFSpot' },
    { lat: -61.9493, lng: -52.3169, title: 'EMF Detected Spot (X: -209, Y: 306)', type: 'EMFSpot' },
    { lat: -5.1645, lng: -3.3087, title: 'EMF Detected Spot (X: -11, Y: 19)', type: 'EMFSpot' },
    { lat: 83.1636, lng: 163.9160, title: 'Flesh Rain (X: 651, Y: -641)<br>Note', type: 'Note' },
    { lat: 46.6344, lng: 128.1006, title: 'Tree Test (X: 518, Y: -211)<br>Note', type: 'Note' },
    { lat: -78.7464, lng: 52.3608, title: 'Hell Message (X: 213, Y: 541)<br>Note', type: 'Note' },
    { lat: -82.2231, lng: 13.9966, title: 'Fishermans Note (X: 58, Y: 627)<br>Note', type: 'Note' },
    { lat: -0.6152, lng: 2.3730, title: 'Report Example (X: 5, Y: 0)<br>Note (Removed)', type: 'Note' },
    { lat: -6.0313, lng: -3.0542, title: 'Smiley Face (X: -13, Y: 19)<br>Note (Removed)', type: 'Note' },
    { lat: -3.8204, lng: -1.7798, title: 'Dees Diary (X: -9, Y: 6)<br>Note', type: 'Note' },
    { lat: -1.5599, lng: 1.3843, title: 'Inside Password (X: 1, Y: 5)<br>Note', type: 'Note' },
    { lat: -2.0869, lng: -2.8125, title: 'Admin Password (X: -14, Y: -10)<br>Note', type: 'Note' },
    { lat: -5.9658, lng: 6.0205, title: 'Bunker Warning (X: 20, Y: 23)<br>Note', type: 'Note' },
    { lat: 7.8452, lng: 4.8836, title: 'Placeholder Test (X: 19, Y: -31)<br>Note (Removed)', type: 'Note' },
    { lat: -9.5141, lng: 5.3613, title: 'Behind You (X: 17, Y: 36)<br>Note (Removed)', type: 'Note' },
    { lat: 61.6690, lng: 59.0845, title: 'The Hole Preparation (X: 233, Y: -322)<br>Note (Removed)', type: 'Note' },
    { lat: -11.3723, lng: -86.9238, title: 'The Hole Expedition (X: -351, Y: 46)<br>Note', type: 'Note' },
    { lat: 8.1462, lng: -154.0503, title: 'The Hole Discovery (X: -620, Y: -29)<br>Note', type: 'Note' },
    { lat: 30.0311, lng: 155.6543, title: 'Mockery (X: 626, Y: -128)<br>Note (Removed)', type: 'Note' },
    { lat: 22.5531, lng: -19.3359, title: 'Paper Alien Warning (X: -80, Y: -94)<br>Note (Event Specific)', type: 'Note' },
    { lat: 22.6748, lng: -18.6328, title: 'Ariral Hate (X: -80, Y: -94)<br>Note (Event Specific)', type: 'Note' },
    { lat: 21.9227, lng: -19.4458, title: 'Ariral Love (X: -80, Y: -94)<br>Note (Event Specific)', type: 'Note' },
    { lat: 22.1874, lng: -18.7646, title: 'Ariral Ally (X: -80, Y: -94)<br>Note (Event Specific)', type: 'Note' },
    { lat: -68.4234, lng: 93.8452, title: 'Ariral Warning (X: 378, Y: 388)<br>Note (Event Specific)', type: 'Note' },
    { lat: -1.8454, lng: 1.6479, title: 'Ariral Vaccine Instructions (X: 2, Y: 6)<br>Note (Event Specific)', type: 'Note' },
    { lat: -82.1485, lng: 79.1016, title: 'Music Warning (X: 388, Y: 531)<br>Note', type: 'Note' },
    { lat: -7.3625, lng: 0.1978, title: 'Figure Encounter (X: -1, Y: 27)<br>Note', type: 'Note' },
    { lat: 75.4144, lng: -98.0420, title: 'Cryptomining Tips (X: -394, Y: -475)<br>Note (Removed)', type: 'Note' },
    { lat: -5.4848, lng: -4.0430, title: 'Rocks<br>(X: -19, Y: 19) Note', type: 'Note' },
    { lat: -1.2523, lng: -5.1636, title: 'Recycling (X: -23, Y: 11)<br>Note', type: 'Note' },
    { lat: -2.6577, lng: 0.3955, title: 'A Secret (X: -0, Y: 22)<br>Note', type: 'Note' },
    { lat: 11.2646, lng: -153.7646, title: 'A Scam (X: -618, Y: -16)<br>Note (Removed)', type: 'Note' },
    { lat: 67.3906, lng: 92.1533, title: 'Pickaxe (X: -391, Y: -384)<br>You can mine crystals and coal in the cave using this.', type: 'Other' },
    { lat: 80.3791, lng: -166.6406, title: 'Furfur Altar Piece (X: -671, Y: -563)<br>Furfur Altar Piece', type: 'Other' },
    { lat: -34.5609, lng: -78.9697, title: 'Earth Rune Box (X: -320, Y: 148)<br>Farm Earth Runes', type: 'Other' },
    { lat: 84.5162, lng: 129.7705, title: 'Water Rune Box (X: 627, Y: -874)<br>Farm Water Runes', type: 'Other', arrowRotation: 180, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue'  },
    { lat: 77.5231, lng: 0.7031, title: 'Erie Zone (X: 11, Y: -512)<br>Zone where you can farm and obtain Erie Plushes.', type: 'Other' },
    { lat: -10.4345, lng: 4.9668, title: 'Omega Kerfus Blueprint (X: 17, Y: 40)<br>Crafting blueprint for Omega Kerfuses.', type: 'Other' },
    { lat: 62.3496, lng: 57.8320, title: 'Barrel of MREs (X: 232, Y: -329)<br>Barrel of free food.', type: 'Other' },
    { lat: 39.9097, lng: 132.4512, title: 'Earth Rune Slab (X: 538, Y: -181)<br>Dig in exactly as the coordinates say which would be under a bush.', type: 'Other' },
    { lat: 71.8836, lng: 101.4258, title: 'Water Rune Slab (X: 418, Y: -422)<br>Dig at the deepest point of The Lake.', type: 'Other' },
    { lat: -43.4050, lng: 95.3613, title: 'Air Rune Slab (X: 387, Y:196)<br>You must grab it from the top of the Powerline Pole.', type: 'Other' },
    { lat: -84.8500, lng: 175.6934, title: 'Fire Rune Slab (X: 1,991, Y: 1999)<br>Will require the Ritual Warp Event, dig up the slab from behind ritual table and jump out the island to land safely on top of the Small Graveyard Landmark.', type: 'Other', arrowRotation: -45, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -5.2441, lng: 101.3818, title: 'Wendigo Skull (X: 408, Y: 22)<br>Located within the Wooded Shack underneath an red ariral forest tree.', type: 'Other' },
    { lat: 59.2097, lng: -15.2271, title: 'Argemia Mug (X: -58, Y: -295)<br>Located on top of the power line pole, can only be accessed by grabbing it, no object or prop can push it off.', type: 'Other' },
    { lat: 84.7424, lng: -177.1655, title: 'Bryn Fruit (X: -785, Y: -821)<br>Located behind a tree near Erie and Argemia Statues.', type: 'Other', arrowRotation: 135, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -43.6440, lng: 98.3496, title: 'Transformer 0 (X: 396, Y: 199)<br>Gameplay Mechanic', type: 'Gameplay' },
    { lat: -49.7387, lng: -135.6812, title: 'Transformer 1 (X: -548, Y: 232)<br>Gameplay Mechanic', type: 'Gameplay' },
    { lat: 75.1013, lng: -98.3716, title: 'Transformer 2 (X: -397, Y: -472)<br>Gameplay Mechanic', type: 'Gameplay' },
    { lat: -15.9191, lng: 16.6992, title: 'Power Generator (X: 63, Y: 63)<br>Gameplay Mechanic', type: 'Gameplay' },
    { lat: 83.6478, lng: 130.7153, title: 'Tombstone (X: 524, Y: -672)<br>Object (Random Spawn)', type: 'Landmark' },
    { lat: -10.5094, lng: 157.1924, title: 'Ship Engine (X: 637, Y: 44)<br>Object', type: 'Landmark' },
    { lat: -82.1754, lng: 151.6333, title: 'SCP-432 (X: 613, Y: 623)<br>Object', type: 'Landmark' },
    { lat: 83.5102, lng: -40.9131, title: 'Fake Maxwell (X: -166, Y: -665)<br>Object', type: 'Landmark' },
    { lat: 74.3726, lng: 110.6982, title: 'Invisible Boulder (X: 437, Y: -467)<br>Object (Removed)', type: 'Landmark' },
    { lat: 80.1186, lng: 169.0137, title: 'Green Campfire (X: 680, Y: -573)<br>Object', type: 'Landmark' },
    { lat: 64.4444, lng: 70.7520, title: 'Hanged Man (X: 280, Y: -349)<br>Object', type: 'Landmark' },
    { lat: 84.8559, lng: -177.7808, title: 'Erie and Argemia Statues (X: -801, Y: -814)<br>Outside the fence.', type: 'Landmark', arrowRotation: 135, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -84.3888, lng: -92.5269, title: 'Guard Post (X: -373, Y: 703)<br>Outside the fence.', type: 'Landmark' },
    { lat: -0.5054, lng: 0.8350, title: 'Main Base (X: 0, Y: 0)<br>Located in the middle of the entire world.', type: 'Landmark' },
    { lat: -6.7955, lng: 6.0645, title: 'Bunker (X: 20, Y: 25)<br>Located right beside the Main Base.', type: 'Landmark' },
    { lat: 7.2535, lng: 5.7788, title: 'Radio Tower (X: 19, Y: -31)<br>Located right beside the Main Base.', type: 'Landmark' },
    { lat: -78.7977, lng: 52.0752, title: 'Stonehenge (X: 213, Y: 541)<br>Throw and jump into ATV over the fence to access.', type: 'Landmark' },
    { lat: -11.6953, lng: -87.1875, title: 'Light Bone Pit (X: -352, Y: 47)<br>Located between the Kilo and Lima Satellite Dishes, simply walk in between them and up.', type: 'Landmark' },
    { lat: -59.6344, lng: -140.6909, title: 'Darkened Bone Pit (X: -569, Y: 303)<br>Near X-ray.', type: 'Landmark' },
    { lat: 30.0501, lng: 155.1489, title: 'Deep Pit (X: 626, Y: -128)<br>Near Uniform Satellite Dish and near the fence.', type: 'Landmark' },
    { lat: 80.9146, lng: -161.1475, title: 'AB Cave (Antibreather Cave) (X: -651, Y: -585)<br>Near Romeo Satellite Dish, on the side of a giant cliff.', type: 'Landmark' },
    { lat: 81.4793, lng: -4.5703, title: 'Ariral Picnic (X: -192, Y: -500)<br>Near Sierra Satellite Dish in a valley. (Event specific).', type: 'Landmark' },
    { lat: -68.4880, lng: 91.3403, title: 'Ariral Treehouse (X: 366, Y: 388)<br>Near the Stonehenge Landmark (Event specific).', type: 'Landmark' },
    { lat: 7.4714, lng: -153.7427, title: 'The Hole (X: -618, Y: -27)<br>Near Yankee Satellite Dish.', type: 'Landmark' },
    { lat: 21.3917, lng: -174.4629, title: 'Fence Opening (X: -697, Y: -80)<br>Near The Hole.', type: 'Landmark' },
    { lat: 50.4015, lng: -177.0117, title: 'Secret Staircase (X: 1293, Y: -223)<br>Inaccessible in Storymode,<br>location is outside the barrier.', type: 'Landmark', arrowRotation: 90, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: -84.9438, lng: -89.6484, title: 'Large Bone Pit (X: -265, Y: 1005)<br>Inaccessible in Storymode, location is outside the barrier, near Guard Post.', type: 'Landmark', arrowRotation: 0, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: 48.8647, lng: -161.1035, title: 'Crashed Ariral Tp Chamber (X: -651, Y: -237)<br>Located in the bottom of the valley near the Fence Opening (Event specific).', type: 'Landmark' },
    { lat: -54.1238, lng: 139.1089, title: 'Abandoned Well (X: 564, Y: 265)<br>Located between the Uniform and Victor satellite Dishes.', type: 'Landmark' },
    { lat: 80.0580, lng: -86.3745, title: 'Small Graveyard (X: -347, Y: -563)<br>Located on a hill above Transformer 2.', type: 'Landmark' },
    { lat: 55.9000, lng: 168.1348, title: 'Shrimp Sewer (X: 675, Y: -277)<br>In the river near the Danger Forest.', type: 'Landmark' },
    { lat: 76.4758, lng: 142.4268, title: 'Leaking Nuclear Barrels (X: 570, Y: -517)<br>In the river near the Danger Forest.', type: 'Landmark' },
    { lat: -61.8872, lng: -51.7236, title: 'Abandoned Sedan (X: -209, Y: 307)<br>In the river near the Quebec Satellite Dish.', type: 'Landmark' },
    { lat: -5.7909, lng: 101.2500, title: 'Wooded Shack (X: 408, Y: 22)<br>Located in a dense forest near Uniform Satellite Dish.', type: 'Landmark' },
    { lat: -80.4886, lng: 2.7246, title: 'William The Protector (X: 12, Y: 580)<br>Located between the Whiskey Satellite Dish and the Bomb Shelter.', type: 'Landmark' },
    { lat: -82.1545, lng: 14.6558, title: 'Bomb Shelter (X: 60, Y: 625)<br>Located near the Circle of Benches.', type: 'Landmark' },
    { lat: 81.0523, lng: 156.0059, title: 'Danger Forest (X: -642, Y: -586)<br>Located in the corner of land that is cut off by the river, near Tango Satellite Dish.', type: 'Landmark' },
    { lat: 47.3388, lng: 132.0117, title: 'Closed Up Forest (X: 517, Y: -211)<br>Located near the Deep Pit, throw and jump into ATV over the fence to access.', type: 'Landmark' },
    { lat: -84.8025, lng: 177.4512, title: 'Ritual Altar (X: 1994, Y: 1999)<br>You need to perform the Ritual Warp Event in order to warp to this landmark.', type: 'Landmark', arrowRotation: -45, arrowHeight: 20, arrowWidth: 8, arrowColor: 'blue' },
    { lat: 2.9869, lng: 1.1865, title: 'Green Cabinent Room (X: -1, Y: -14)<br>Innacessible in storymode, you could attempt to glitch or noclip inside the SCP-421 to warp there.<br>Actual landmark is located underneath the map.', type: 'Landmark' },
    { lat: 70.0806, lng: 97.9102, title: 'The Lake (X: 408, Y: -406)<br>Giant lake.', type: 'Landmark' },
    { lat: 83.6673, lng: 166.3770, title: 'Abandoned Church (X: 662, Y: -654)<br>Located near the Green Campfire spawn in the corner of the fence almost.', type: 'Landmark' },
    { lat: 8.4072, lng: -137.2852, title: 'Abandoned Housing (X: -553, Y: -56)<br>Located between the Yankee Satellite Dish and The Hole.', type: 'Landmark' },
    { lat: 70.9740, lng: 100.9424, title: 'Flesh Pit (X: 410, Y: -416)<br>Located underwater in The Lake.', type: 'Landmark' },
    { lat: -84.2672, lng: -93.7793, title: 'Pumpkin (Halloween Special) (X: -382, Y: 695)<br>Located near Guard Post.', type: 'Pumpkin' },
    { lat: -43.4370, lng: -23.8184, title: 'Pumpkin (Halloween Special) (X: -103, Y: 199)<br>Located on the top level of the Juliett Satellite Dish.', type: 'Pumpkin' },
    { lat: -4.0177, lng: -2.0215, title: 'Pumpkin (Halloween Special) (X: -6, Y: 10)<br>Located behind some supply boxes.', type: 'Pumpkin' },
    { lat: -1.2304, lng: 2.5708, title: 'Pumpkin (Halloween Special) (X: 6, Y: 0)<br>Located in front of the computer terminal.', type: 'Pumpkin' },
    { lat: -6.0750, lng: 3.0542, title: 'Pumpkin (Halloween Special) (X: 10, Y: 20)<br>Located on the corner edge of the Main Base roof.', type: 'Pumpkin' },
    { lat: 2.0530, lng: 66.5585, title: 'Pumpkin (Halloween Special) (X: 221, Y: -61)<br>Located on top of the boulder.', type: 'Pumpkin' },
    { lat: 84.3022, lng: 133.4619, title: 'Pumpkin (Halloween Special) (X: -534, Y: -699)<br>Located on the fence ledge behind lamp post.', type: 'Pumpkin' },
    { lat: 58.7910, lng: -21.0498, title: 'Pumpkin (Halloween Special) (X: -192, Y: -238)<br>Located near the same powerline pole that the Argemia Mug sits on.', type: 'Pumpkin' },
    { lat: 2.4382, lng: 8.0640, title: 'Pumpkin (Halloween Special) (X: 30, Y: -13)<br>Located on top of the event pole near the Main Base.', type: 'Pumpkin' },
    { lat: -3.3380, lng: -14.5679, title: 'Pumpkin (Halloween Special) (X: -64, Y: 7)<br>Located on top of the bridge.', type: 'Pumpkin' },
    { lat: 28.6444, lng: 43.6994, title: 'Pumpkin (Halloween Special) (X: 174, Y: -127)<br>Located underwater near Echo Satellite Dish.', type: 'Pumpkin' },
    { lat: -76.2895, lng: -0.2417, title: 'Pumpkin (Halloween Special) (X: 2, Y: 503)<br>Located in the base of Whiskey Satellite Dish.', type: 'Pumpkin' },
    { lat: -77.0739, lng: 114.2358, title: 'Pumpkin (Halloween Special) (X: 466, Y: 514)<br>Located near the Victor Satellite Dish.', type: 'Pumpkin' },
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
