((scope) ->

  scope.params = []

  strUrl = location.search
  unless strUrl.indexOf("?") is -1
    getPara = undefined
    ParaVal = undefined
    getSearch = strUrl.split("?")
    getPara = getSearch[1].split("&")
    i = 0
    while i < getPara.length
      ParaVal = getPara[i].split("=")
      params.push ParaVal[0]
      params[ParaVal[0]] = ParaVal[1]
      i++


  layer = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg",
    subdomains: "1234"
  )

  scope.taiwanCenter = new L.LatLng(23.974093,120.979903)

  scope.map = new L.Map("map",
    layers: layer
    center: taiwanCenter
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
  scope.otherIcon = new LeafIcon(iconUrl: "/images/singing.png")
  scope.factoryIcon = new LeafIcon(iconUrl: "/images/coal-power-plant-icon.png")

  L.Icon.Default.imagePath = "/images/leaflet/images"
  scope.myIcon = new L.Icon.Default()
  scope.setMarkerOnMapArea = (marker, position, callback) ->
    marker.setLatLng position,
      draggable: "true"

    callback.call this, position  unless typeof callback is "undefined"
    return

  scope.setLocationNumfunction = (point) ->
    obj = $("#location_lat")
    if obj.length
      $("#location_lat").val point.lat
      $("#location_lng").val point.lng
    return

  L.control.locate().addTo(map);

  onLocationFound = (e) ->
    setMarkerOnMapArea(myMarker,e.latlng,setLocationNumfunction);

  map.on('locationfound',onLocationFound);

) window