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
  scope.otherMarker = new LeafIcon(iconUrl: "/assets/coal-power-plant-icon.png")
  scope.myMarker = new LeafIcon(iconUrl: "/assets/people/Pope.png")

  MapApp = (map, icon, callback) ->
    point = undefined
    point = map.getCenter()
    @marker = L.marker(point,
      icon: icon
      draggable: "true"
    ).addTo(map)


    @setMarkerOnMapArea = (theMarker, thePosition) ->
      theMarker.setLatLng thePosition,
        draggable: "true"

      map.panTo thePosition
      point = thePosition
      callback.call this, point  unless typeof callback is "undefined"
      return

    @marker.on "dragend", (event) ->
      eventTarget = undefined
      position = undefined
      eventTarget = event.target
      position = eventTarget.getLatLng()
      @setMarkerOnMapArea eventTarget, position
      return

    map.on "click", (e) ->
      @setMarkerOnMapArea @marker, e.latlng
      return

    @getPoint = ->
      point

    return

  scope.mapApp = new MapApp(map, myMarker)

  return

) window