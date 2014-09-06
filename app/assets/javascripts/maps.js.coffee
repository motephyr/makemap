((scope) ->
  scope.layer = L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg",
    
    # attribution: 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: "1234"
  )
  scope.map = new L.Map("map",
    layers: layer
    center: new L.LatLng(25, 122)
    zoom: 8
  )
  scope.LeafIcon = L.Icon.extend(options:
    iconSize: [
      64
      64
    ]
    shadowSize: [
      50
      64
    ]
    iconAnchor: [
      22
      94
    ]
    shadowAnchor: [
      4
      62
    ]
    popupAnchor: [
      10
      -86
    ]
  )
  scope.otherMarker = new LeafIcon(iconUrl: "/assets/people/teacher.png")
  scope.myMarker = new LeafIcon(iconUrl: "/assets/people/Pope.png")
  scope.MapApp = (map, icon) ->
    marker = undefined
    point = undefined
    setMarkerOnMapArea = undefined
    point = map.getCenter()
    marker = L.marker(point,
      icon: icon
      draggable: "true"
    ).addTo(map)
    setMarkerOnMapArea = (theMarker, thePosition) ->
      theMarker.setLatLng thePosition,
        draggable: "true"

      map.panTo thePosition
      point = thePosition
      return

    marker.on "dragend", (event) ->
      eventTarget = undefined
      position = undefined
      eventTarget = event.target
      position = eventTarget.getLatLng()
      setMarkerOnMapArea eventTarget, position
      return

    map.on "click", (e) ->
      setMarkerOnMapArea marker, e.latlng
      return

    @getPoint = ->
      point

    return

  return
) window