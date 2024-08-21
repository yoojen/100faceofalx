
 function myMap() {
   const center = new google.maps.LatLng(-1.9441, 30.0619);
   let zoomValue = 8;
   var mapProp = {
     center: new google.maps.LatLng(-1.9441, 30.0619),
     zoom: zoomValue,
   };
   var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
   var marker = new google.maps.Marker({ position: center });

   marker.setMap(map);
   // Zoom to 9 when clicking on marker
   google.maps.event.addListener(marker, "click", function () {
     map.setZoom(newZoomValue);
     map.setCenter(marker.getPosition());
   });
}