  LeafIcon = L.Icon.extend({
    options: {
      iconSize: [64, 64]
    }
  });
(function(window) {
  var ParaVal, getPara, getSearch, i, layer, onLocationFound, strUrl;
  window.params = [];
  strUrl = location.search;
  if (strUrl.indexOf("?") !== -1) {
    getPara = void 0;
    ParaVal = void 0;
    getSearch = strUrl.split("?");
    getPara = getSearch[1].split("&");
    i = 0;
    while (i < getPara.length) {
      ParaVal = getPara[i].split("=");
      params.push(ParaVal[0]);
      params[ParaVal[0]] = ParaVal[1];
      i++;
    }
  }
  layer = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg", {
    subdomains: "1234"
  });
  window.taiwanCenter = new L.LatLng(23.974093, 120.979903);
  window.map = new L.Map("map", {
    layers: layer,
    center: taiwanCenter,
    zoom: 8,
    minZoom: 4
  });

  window.otherIcon = new LeafIcon({
    iconUrl: "/images/singing.png"
  });
  window.factoryIcon = new LeafIcon({
    iconUrl: "/images/coal-power-plant-icon.png"
  });
  L.Icon.Default.imagePath = "/images/leaflet/images";
  window.myIcon = new L.Icon.Default();
  window.setMarkerOnMapArea = function(marker, position, callback) {
    marker.setLatLng(position);
    map.setView(position);

    if (typeof callback !== "undefined") {
      callback.call(this, position);
    }
  };
  window.setLocationNumfunction = function(point) {
    var obj;
    obj = $("#location_lat");
    if (obj.length) {
      $("#location_lat").val(point.lat);
      $("#location_lng").val(point.lng);
    }
  };
  L.control.locate().addTo(map);
  onLocationFound = function(e) {
    return setMarkerOnMapArea(window.myMarker, e.latlng, setLocationNumfunction);
  };
  map.on('locationfound', onLocationFound);
})(window);
