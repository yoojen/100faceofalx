(function (window, leaflet) {
  class MapClass {
    constructor(element, opts) {
      this.element = element;
      this.opts = opts;
      this.map = null;
      this.markers = []
    }

    create() {
      this.map = leaflet.map(this.element, this.opts);
      return this.map;
    }
    zoom(level) {
        if (level) {
            this.map.setZoom(level);
        }
        return this.map.getZoom();
    }
    /**
     * Public method that trigger event on map
     * @param {String} event 
     * @param {function} callback 
     */
    onEvent(opts) {
      opts.obj.on(opts.event, opts.callback)
    }

    /**
     * Private method for creating marker instance
     * @param {Array} latlng 
     * @param {Object} opts 
     * @returns marker instance
     */
    _createMarker(latlng, opts) {
      return leaflet.marker(latlng, opts ? opts : null)
    }

    /**
     * Public method to add created marker on the map
     * @param {Array} latlng 
     * @param {Object} opts 
     * @returns marker
     */
    addMarker(opts) {
      self = this;
      const latlng = opts.latlng;
      // delete latlng from options
      delete opts.latlng
      const marker = this._createMarker(latlng, opts)
      this.markers.push(marker)

      if (opts.event) {
        this.onEvent({
          obj: marker,
          event: opts.event.name,
          callback: function (e) {
            var tooltip = L.tooltip(e.latlng, { content: opts.event.content })
            tooltip.addTo(self.map)
          }
        })
        // marker.on(opts.event.name, opts.event.callback)
      }
      marker.addTo(this.map)
      return marker
    }

    /**
     * Remove marker from map
     * @param {L.marker} marker 
     */
    removeMarker(marker) {
      const indexOfMarker = this.markers.indexOf(marker);
      if (indexOfMarker !== -1) {
        this.markers.splice(marker, 1)
        marker.remove()
      }
    }

    findMarker(latlng) {
      let matches = []
      this.markers.find((marker) => {
        let formated = { lat: marker._latlng.lat, lng: marker._latlng.lng }
        
        if ((formated.lat == latlng.lat) && (formated.lng == latlng.lng)) {
          matches.push(marker);
        }
      })
      return matches;
    }
  }
    window.MapClass = MapClass;
})(window, L, window.MapClass);