(function (window, MyMap) {
  // map options
  const options = window.MAP_OPTIONS;

  // initialize map
  const element = "map";
  const mapObject = new MyMap(element, options.MAP_OPTIONS);
  // create map
  const map = mapObject.create();

  const marker = mapObject.addMarker({
    latlng: [
      -1.3906486179213423,
      29.745858907699585
    ],
    draggable: true,
    event: {
    name: 'click',
    content: 'now clicked' 
    }
  })
  const marker2 = mapObject.addMarker({
    latlng: [
      -1.3796486179213423,
      29.746
    ],
    draggable: true,
    event: {
    name: 'click',
    content: 'now clicked' 
    }
  })
  var imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[-1.3796486179213423, 29.746], [-1.379, 29.999]];
  L.imageOverlay(imageUrl, imageBounds).addTo(map);

  mapObject.zoom(13)
})(window, window.MapClass);

