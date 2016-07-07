var request = new XMLHttpRequest();
request.open("GET", "./assets/buildings.json");
request.onload = function() {
  var parsed = JSON.parse(request.responseText);
  parsed.forEach(function(item) {
    item.searchDistrict = item.district.toLowerCase();
    item.searchSchool = item.school.toLowerCase();
  });
  self.postMessage({ signal: "buildings", parsed });
}
request.send();