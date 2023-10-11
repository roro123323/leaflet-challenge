 //Store JSON information from USGS
 let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });
  //Create a Leaflet map object
  let myMap = L.map("map", {
    center: [44.967243, -103.771556],
    zoom: 3,
  });
  street.addTo(myMap);
  
  function getDepth(depth) {
    switch (true) {
      case depth > 90: return '#DC143C';
      case depth > 70: return '#FF4500';
      case depth > 50: return '#FFA500';
      case depth > 30: return '#FFD700';
      case depth > 10: return '#FFFF00';
      default: return '#98ee00';
    }
  }
  function getRadius(magnitude) {
    magnitude * 500;
    // if (magnitude === 0) { return 1; } return magnitude * 5;
  }
  // Perform a GET request to the query URL/
  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function (data) {
  
    //Set style for markers
    function styles(feature) {
      return {
        //color: chooseColor(feature.geometry.coordinates[2]),
        //radius: chooseRadius(feature.properties.mag),
        //fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        opacity: 2,
        color: "#000000",
        fillColor: getDepth(feature.geometry.coordinates[2]),
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      }
        ;
    }
  
    L.geoJson(data, {
      pointToLayer: function (feature, latLng) { return L.circleMarker(latLng); },
      style: styles,
      onEachFeature: function (feature, layer) {
        layer.bindPopup("magnitude: " + feature.properties.mag +
          "<br>depth: " + feature.geometry.coordinates[2]
          + "<br>location: "
          + feature.properties.place);
      }
    }).addTo(myMap)
  
    // Create a legend control and specify its position (bottom-right corner)
      var legend = L.control({
       position: 'bottomright'
     });
  
    // Function to generate the legend HTML content
         legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend');
           var grades = [-10, 10, 30, 50, 70, 90];
           var colors = [
            "#98ee00",
            "#FFFF00",
            "#FFD700",
            "#FFA500",
            "#FF4500",
            "#DC143C"
          ];
  
          // Looping through our intervals to generate a label with a colored square for each interval.
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
        };
  
  
    // // Loop through the depth intervals and generate labels
    //        for (var i = 0; i < depths.length; i++) {
    //          var from = depths[i];
    //          var to = depths[i + 1];
  
    //          labels.push(
    //            '<i style="background:' + getDepth(from + 1) + '"></i> ' +
    //            from + (to ? '&ndash;' + to + ' km' : '+ km')
    //          );
    //        }
    //        div.innerHTML = '<p>Earthquake Depth</p>' + labels.join('<br>');
    //        return div;
    //      };
    //      legend.addTo(myMap);
  
  
  });