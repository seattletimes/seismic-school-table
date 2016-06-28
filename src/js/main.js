// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var debounce = require("./lib/debounce");

var m = require("mithril");
var output = document.querySelector(".render-here");

const LIMIT = 50;

var render = function(rows) {
  if (!rows.length) {
    return m("tr", [m("td", { class: "placeholder", colspan: 20 }, "Search to find schools")]);
  }

  return rows.map(r => {
    return m("tr", [
      m("td", { class: "district" }, r.district),
      m("td", { class: "school" }, r.school),
      m("td", { class: "pga" }, r.pga),
      m("td", { class: "soil" }, r.soil),
      m("td", { class: "buildings" }, r.buildings.map(b => {
        var timeframe = b.built < 1964 ? "oldest" : b.built < 1975 ? "old" : "new";
        var title = `${b.building} - built in ${b.built}`;
        return m("div", {
          class: `${timeframe} ${b.type.toLowerCase()} building`,
          title: title
        }, [
          // m("div", { class: "tooltip" }, title)
        ]);
      }))
    ]);
  });
}

// this is a lot to parse, let's do it in a worker
var worker = new Worker("./worker.js");
worker.onmessage = function(message) {
  var data = message.data;
  if (!data.signal) return;

  var filters = document.querySelector(".filters");
  var searchBox = document.querySelector(".search");

  var run = debounce(function() {
    var query = searchBox.value;
    var subset = !query ? [] : data.parsed.filter(function(r) {
      if (r.district.toLowerCase().indexOf(query) > -1) return true;
      if (r.school.toLowerCase().indexOf(query) > -1) return true;
      return false;
    });
    if (subset.length > LIMIT) {
      filters.classList.add("excess");
    } else {
      filters.classList.remove("excess");
    }
    m.render(output, render(subset.slice(0, LIMIT)));
  });

  searchBox.addEventListener("keyup", run);
  run();

}