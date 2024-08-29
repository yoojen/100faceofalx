(function (window, MyMap) {
  // map options
  const options = window.MAP_OPTIONS;

  // initialize map
  const element = "map";
  const mapObject = new MyMap(element, options.MAP_OPTIONS);
  // create map
  const map = mapObject.create();
  
  mapObject.onEvent({
    event: 'click',
    obj: map,
    callback: function (e) {
      alert('map clicked')
    }
  })

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
  // mapObject.removeMarker(marker)
  // const match = mapObject.findMarker({ lat: -1.3906486179213422, lng: 29.745858907699585 });
  
  /*
  let i = 0;
  for (; i < 40; i++){
    let marker2 = mapObject.addMarker({
      latlng: [
        -1.8796486179213423,
        29.145858907699585
      ],
      draggable: true,
      event: {
        name: 'click',
        callback: function (e) {
          var tooltip = L.tooltip(e.latlng,
            { content: 'Your Location' }
          )
          .addTo(map);
        }
      }
    })
  }*/
  mapObject.zoom(13)
})(window, window.MapClass);

