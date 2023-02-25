if (window.location.pathname.startsWith("/tour")) {
  const locations = JSON.parse(
    document.getElementById("map").dataset.locations
  );

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2t5dGVjaDAwMSIsImEiOiJjbGVnY3dzcDQwZm93M3hyeDBnMm8wbXNsIn0.WQEZ9bPgyl8ek7ZWIe9gUA";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/skytech001/clegeb2po000401o8m7939bex",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement("div");
    el.className = "marker";

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //   new mapboxgl.Popup({
    //     offset: 30,
    //   })
    //     .setLngLat(lac.coordinates)
    //     .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    //     .addTo(map);

    //Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
