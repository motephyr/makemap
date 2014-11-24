((scope) ->
  layer = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg",
    subdomains: "1234"
  )
  scope.map = new L.Map("map",
    layers: layer
    center: new L.LatLng(23.974093,120.979903)
    zoom: 8
    minZoom: 4
  )
  LeafIcon = L.Icon.extend(options:
    iconSize: [
      64
      64
    ]
    # shadowSize: [
    #   50
    #   64
    # ]
    # iconAnchor: [
    #   22
    #   64
    # ]
    # shadowAnchor: [
    #   4
    #   62
    # ]
    # popupAnchor: [
    #   10
    #   -86
    # ]
  )
  scope.otherIcon = new LeafIcon(iconUrl: "/assets/singing.png")
  scope.factoryIcon = new LeafIcon(iconUrl: "/assets/coal-power-plant-icon.png")

  scope.myIcon = new L.Icon.Default() 
  scope.setMarkerOnMapArea = (marker, position, callback) ->
    marker.setLatLng position,
      draggable: "true"
  
    map.panTo position
    callback.call this, position  unless typeof callback is "undefined"
    return

  scope.setLocationNumfunction = (point) ->
    obj = $("#location_lat")
    if obj.length
      $("#location_lat").val point.lat
      $("#location_lng").val point.lng
    return



) window