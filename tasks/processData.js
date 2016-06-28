module.exports = function(grunt) {

  grunt.registerTask("process", function() {

    var data = grunt.data.csv.buildings;

    var collected = {};

    data.forEach(function(row) {
      var key = row.district + "|" + row.school;
      if (!collected[key]) collected[key] = {
        district: row.district,
        school: row.school,
        pga: row.pga,
        soil: row.soil,
        buildings: []
      };
      collected[key].buildings.push({
        building: row.building,
        type: row.type,
        built: row.built
      });
    });

    var unwrapped = [];
    for (var k in collected) {
      unwrapped.push(collected[k]);
    }

    grunt.file.write("src/assets/buildings.json", JSON.stringify(unwrapped));

  });

}