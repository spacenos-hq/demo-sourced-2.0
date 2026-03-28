/**
 * Real maps: OpenStreetMap tiles via Leaflet + CARTO dark basemap.
 * Markers: optional JSON on data-markers='[{"lat":..,"lng":..,"label":".."}]'
 */
(function () {
  function tileLayer() {
    return L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    );
  }

  function init(el) {
    if (typeof L === "undefined" || el._sourcedMapInit) return;
    el._sourcedMapInit = true;

    var lat = parseFloat(el.getAttribute("data-lat") || "41.824", 10);
    var lng = parseFloat(el.getAttribute("data-lng") || "-71.4128", 10);
    var zoom = parseInt(el.getAttribute("data-zoom") || "12", 10);

    var map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    });
    map.setView([lat, lng], zoom);
    tileLayer().addTo(map);

    var raw = el.getAttribute("data-markers");
    if (raw) {
      try {
        var list = JSON.parse(raw);
        var bounds = [];
        list.forEach(function (m) {
          if (typeof m.lat !== "number" || typeof m.lng !== "number") return;
          var circle = L.circleMarker([m.lat, m.lng], {
            radius: m.r || 6,
            color: "#10b981",
            weight: 2,
            fillColor: "#10b981",
            fillOpacity: 0.75
          }).addTo(map);
          if (m.label) circle.bindTooltip(m.label, { direction: "top", offset: [0, -4] });
          bounds.push([m.lat, m.lng]);
        });
        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [24, 24], maxZoom: zoom });
        }
      } catch (e) {
        /* ignore malformed JSON */
      }
    }

    function resize() {
      map.invalidateSize(true);
    }
    setTimeout(resize, 80);
    setTimeout(resize, 400);
    window.addEventListener("resize", resize);
  }

  window.SourcedInitMockMaps = function (root) {
    if (!root) root = document;
    root.querySelectorAll(".mock-map").forEach(init);
  };

  function run() {
    window.SourcedInitMockMaps(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
