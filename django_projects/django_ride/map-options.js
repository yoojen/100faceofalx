(function (window, leaflet, options) {
  options.MAP_OPTIONS = {
    center: {
      lat: -1.3797,
      lng: 29.746,
    },
    zoom: 10,
    zoomControl: true,
    layers: [
      leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ],
  };
})(window, L, window.MAP_OPTIONS || (window.MAP_OPTIONS = {}));