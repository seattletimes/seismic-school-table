var request = new XMLHttpRequest();
request.open("GET", "./assets/buildings.json");
request.onload = function() {
  var parsed = JSON.parse(request.responseText);
  self.postMessage({ signal: "buildings", parsed });
}
request.send();