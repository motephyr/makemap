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
    window.paintingIcon = new LeafIcon({
      iconUrl: "/images/painting.png"
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



    window.get_marker_and_pin_in_map = function(map_id,callback){
      $.ajax({
        url: '/maps/'+map_id+'/locations',
        dataType: "json",
        success: function (data) {
          var markers = new L.MarkerClusterGroup();
          var keysArray = Object.keys(data);
          for (var i in keysArray){

            if(!data[keysArray[i]]["lat"]){
              continue;
            }
            var location_icon = {};
            if(data[keysArray[i]]["location_pin"]){
              location_icon = new LeafIcon({
                iconUrl: data[keysArray[i]]["location_pin"]["pin"].url
              });
            }else{
              location_icon = otherIcon;
            }
            var title = data[keysArray[i]]["title"];
            var location_id = data[keysArray[i]]["id"];
            var marker = L.marker([data[keysArray[i]]["lat"], data[keysArray[i]]["lng"]],{icon:location_icon, location_id:location_id, title:title} )
            markers.addLayer(marker);
            var text = "<h2>"+data[keysArray[i]]["title"]+"</h2>";
            marker.bindPopup(text);

            callback(marker,map_id);
          }
          map.addLayer(markers);
          map.fitBounds(markers.getBounds());
        }
      });
}
})(window);
