(function (window, leaflet, utilities) {
    utilities.icon= L.icon({
      iconUrl: "loc.png",
      iconSize: [40, 40],
      iconAnchor: [0, 0]
    });
    window.utilites = utilities;
})(window, L, window.utilites || (window.utilities = {}));
