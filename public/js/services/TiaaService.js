angular.module('TiaaService', [])
    .factory('Tiaa', ['$http', function($http) {
        return {
            // Below are REST calls to metric api
            mongoGetAll: function() {
                return $http.get('/api/mongometrics');
            },
            mongoCreate: function(tiaaData) {
                return $http.post('/api/mongometrics', tiaaData);
            },
            mongoDelete: function(id) {
                return $http.delete('/api/mongometrics/' + id);
            },
            mongoQuery: function(type, key) {
                return $http.get('/api/mongometrics/query/' + type + '/' + key);
            },

            firebaseGetAll: function() {
                return $http.get('/api/firebasemetrics');
            },
            firebaseCreate: function(tiaaData) {
                return $http.post('/api/firebasemetrics', tiaaData);
            },
            firebaseDelete: function(id) {
                return $http.delete('/api/firebasemetrics/' + id);
            },
            firebaseQuery: function(type, key) {
                return $http.get('/api/firebasemetrics/query/' + type + '/' + key);
            },

            couchGetAll: function() {
                return $http.get('/api/couchmetrics');
            },
            couchCreate: function(tiaaData) {
                return $http.post('/api/couchmetrics', tiaaData);
            },
            couchDelete: function(id, rev) {
                return $http.delete('/api/couchmetrics/' + id + '/' + rev);
            },
            couchQuery: function(type, key) {
                return $http.get('/api/couchmetrics/query/' + type + '/' + key);
            },

            // =========================================
            // Below are functions for making Line Chart
            lineChartMake: function(data, id) {

                var setDims = d3.select(id)
                    .attr("width", "750")
                    .attr("height", "250")
                    .attr("style", "background-color: #34a3d6;");

                var canvas = d3.select(id),
                    WIDTH = 750,
                    HEIGHT = 250,
                    MARGINS = {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 80
                    },
                    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function(d) {
                        return d.x;
                    }), d3.max(data, function(d) {
                        return d.x;
                    })]),
                    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(d) {
                        return d.y;
                    }), d3.max(data, function(d) {
                        return d.y;
                    })]),
                    xAxis = d3.svg.axis()
                        .scale(xRange)
                        .tickSize(1)
                        .tickSubdivide(true),
                    yAxis = d3.svg.axis()
                        .scale(yRange)
                        .tickSize(1)
                        .orient('left')
                        .tickSubdivide(true)
                        .tickFormat(d3.format("$,"));

                canvas.append('svg:g')
                    .attr('class', 'x_axis')
                    .attr('fill', 'white')
                    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
                    .call(xAxis);

                canvas.append('svg:g')
                    .attr('class', 'y_axis')
                    .attr('fill', 'white')
                    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
                    .call(yAxis)
                    .append("text")
                    .attr("x", WIDTH/2 + 100)
                    .attr("y", 35)
                    .attr("dy", ".20em")
                    .attr("font-size", "25")
                    .style("text-anchor", "end")
                    .text("Cash Timeline (7/21/15 - 7/30/15)");

                var line = d3.svg.line()
                    .x(function(d) {
                        return xRange(d.x);
                    })
                    .y(function(d) {
                        return yRange(d.y);
                    })
                    .interpolate('linear');

                canvas.append('svg:path')
                    .attr('d', line(data))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1)
                    .attr('fill', 'none');
            //end
            },

            lineChartSort: function(unsortedList) {
                var len = unsortedList.length;

                for(var i = 0; i < len; i++) {
                    var tmp = unsortedList[i]; // Copy of the current element.
                    /* Check through the sorted part and compare with the
                    number in tmp. If large, shift the number */
                    for(var j = i - 1; j >= 0 && (unsortedList[j].x > tmp.x); j--) {
                        // Shift the number
                        unsortedList[j+1] = unsortedList[j];
                    }
                    // Insert the copied number at the correct position in sorted part.
                    unsortedList[j+1] = tmp;
                }
            }
        }
}]);
