var app = angular.module('CouchCtrl', []);

app.controller('TiaaCouchController', function($scope, $filter, Tiaa) {
    var timerOverview = Date.now();
    $scope.database = 'Cloudant\'s (CouchDB)';
    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        var timerSearch = Date.now();
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        Tiaa.couchQuery('TRN', $scope.TRN).then(function(response) {
            var searchTotal = 0;
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
                searchTotal += response.data[i].CASH;
            }
            $scope.searchTotal = searchTotal;
            console.log('TRN Query: ' + (Date.now() - timerSearch) / 1000 % 60);
        });
    }

    // Overview Information
    $scope.stub = false; // flag for table row stub
    Tiaa.couchGetAll().then(function(response) {

        var total = 0;
        var transactions = response.data.length;
        var result = {}; // dictionary to count CATEGORY, used for Category section
        var trancodes = {}; // dictionary gets all unique trancode
        var categories = {}; // dictionary to count CATEGORY, used for Category section
        var trancode = {};
        var transDay = {};
        var lineData = [];

        // loops through all transactions
        for(var i = 0; i < transactions; i++) {
            total += response.data[i].CASH;

            if(!result[response.data[i].CATEGORY]) {
                result[response.data[i].CATEGORY] = 0;
            }
            result[response.data[i].CATEGORY]++;

            if(!trancodes[response.data[i].TRAN_CODE]) {
                trancodes[response.data[i].TRAN_CODE] = response.data[i].TRAN_CODE;
            }

            if(!transDay[response.data[i].TRADE_DATE]) {
                transDay[response.data[i].TRADE_DATE] = 0;
            }
            transDay[response.data[i].TRADE_DATE] += response.data[i].CASH;
        }
        var average = total / transactions;

        // Line Chart Start
        delete transDay["7/20/2015"];
        delete transDay["7/31/2015"];

        for (var day in transDay) {
            var x = day[2];
            var y = day[3];
            var xy = x.concat(y);
            var date = Number(xy);
            var cash = transDay[day];
            var a = {"x":date, "y":cash};
            lineData.push(a);
        }

        Tiaa.lineChartSort(lineData);
        Tiaa.lineChartMake(lineData, '#line-viz');
        d3.select(".x_axis")
            .selectAll("g")
            .selectAll("text")
            .text(function(d) {
                return '7/' + d;
            });
        // Line Chart End

        $scope.total_cash = Math.round(total).toLocaleString();
        $scope.total_average = Math.round(average).toLocaleString();
        $scope.total_transaction = transactions;

        // =======================================================
        // Category Information. Creates Liquid Gauge per Category
        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleThickness = 0.2;
        config1.circleColor = "#178bca";
        config1.textColor = "#ffffff";
        config1.waveTextColor = "#ffffff";
        config1.waveColor = "#178bca";
        config1.waveHeight = 0.15;
        config1.waveAnimateTime = 1000;

        var i = 1;
        for(var category in result) {
            d3.select("#fillgauge" + i)
                .append("div")
                .attr("id", category);

            var percentage = Math.round(result[category] / transactions * 100);
            loadLiquidFillGauge("fillgauge" + i++, percentage, config1);
        }

        // ===================================================================
        // Trancode-Activity Information: Splitting Trancodes into two columns
        var total_trancode = Object.keys(trancodes).length;
        var i = 0;
        $scope.trancodes_left = [];
        $scope.trancodes_right = [];
        var trancode_to_desc = {
            114: "Contributions",
            301: "Adjustments",
            366: "Transfers",
            394: "Transfers",
            395: "Transfers",
            414: "Distributions",
            444: "Distributions",
            588: "OmniScript"
        }
        for(var trancode in trancodes) {
            if(i % 2 == 0) {
                $scope.trancodes_left.push({
                    "description": trancode_to_desc[trancode] + ' (' + trancode + ')',
                    "id": trancode
                });
            } else {
                $scope.trancodes_right.push({
                    "description": trancode_to_desc[trancode] + ' (' + trancode + ')',
                    "id": trancode
                });
            }
            i++;
        }

        // if odd number of activity, add a stub table row
        if(total_trancode % 2 != 0) {
            $scope.stub = true;
        }

        // timer to calculate page load time for overview
        time = (Date.now() - timerOverview) / 1000 % 60;
        $scope.timer = time;
        console.log('Overview: ' + time);
    });

    // Liquid Guage Selection. Highlights the selected liquid gauge
    $scope.display = false; // flag for overall bottom display
    $scope.rect_display = false; // flag for bar chart display
    $scope.select_gauge = function(id, color) {
        var timerCategory = Date.now();
        $scope.display = true;
        $scope.rect_display = true;

        d3.select("#gauge_display")
            .selectAll("svg")
            .select("g")
            .select("path")
            .style("fill", "#178bca");

        d3.select("#gauge_display")
            .selectAll("svg")
            .select("g")
            .select("g")
            .select("circle")
            .style("fill", "#178bca");

        d3.select("#infoBox").select("table").attr("style", "width: 100%; background-color: " + color + ";");
        d3.select("#" + id).select("g").select("path").style("fill", color);
        d3.select("#" + id).select("g").select("g").select("circle").style("fill", color);

        var category = d3.select("#" + id).select("div").attr("id");
        $scope.category = category;

        // Info window for selected liquid gauge
        Tiaa.couchQuery('CATEGORY', category).then(function(response) {
            var total = 0;
            var transactions = response.data.length;
            var min = response.data[0].CASH;
            var max = response.data[0].CASH;
            result = {};
            for(var i = 0; i < transactions; i++) {
                total += response.data[i].CASH;
                if(response.data[i].CASH > max) {
                    max = response.data[i].CASH;
                }
                if(response.data[i].CASH < min) {
                    min = response.data[i].CASH;
                }

                if(!result[response.data[i].SUB_CATEGORY]) {
                    result[response.data[i].SUB_CATEGORY] = 0;
                }
                result[response.data[i].SUB_CATEGORY]++;
            }
            var average = (total / transactions).toFixed(2);

            $scope.total = total.toLocaleString();
            $scope.average = parseFloat(average).toLocaleString();
            $scope.max = max.toLocaleString().toLocaleString();
            $scope.min = min.toLocaleString();
            $scope.trans = transactions;

            // =========================================
            // Rect Area Chart for selected Liquid Gauge
            d3.select("#rect_display").selectAll("svg").remove();

            var config1 = rectangularAreaChartDefaultSettings();
            config1.expandFromLeft = true;
            config1.expandFromTop = true;
            config1.colorScale = d3.scale.category20b();
            config1.displayValueText = false;
            config1.maxValue = 100;

            var i = 1;
            for(var category in result) {
                config1.colorsScale = d3.scale.ordinal().range(["#37779d", color]);

                var data = [];
                var percent = Math.round(result[category] / transactions * 100).toString();
                var obj = {
                    value: percent,
                    label: category + ": " + percent + "%"
                }
                var obj2 = {
                    value: "100"
                }
                data.push(obj);
                data.push(obj2);

                d3.select("#rect_display")
                    .append("svg")
                    .attr("id", "rectChart" + i)
                    .attr("width", "100%")
                    .attr("height", "18px")
                loadRectangularAreaChart("rectChart" + i++, data, config1);
            }

            console.log('Category Query: ' + (Date.now() - timerCategory) / 1000 % 60);
        });
    }

    $scope.select_trancode = function(code) {
        $scope.display = true;
        $scope.tran_display = true;

        d3.select("#tran_table_left")
            .selectAll("tr")
            .select("td")
            .attr("class", "hover");

        d3.select("#tran_table_right")
            .selectAll("tr")
            .select("td")
            .attr("class", "hover");

        d3.select("#tran_" + code)
            .attr("class", "selected");

        Tiaa.couchQuery('TRAN_CODE', code).then(function(response) {
            var combination = {};
            var transactions = response.data.length;
            for(var i = 0; i < transactions; i++) {
                var combo = response.data[i].TRAN_CODE + '-' + response.data[i].ACTIVITY;
                if(!combination[combo]) {
                    combination[combo] = 0;
                }
                combination[combo]++;
            }

            d3.select("#tran_display").selectAll("svg").remove();

            var config1 = rectangularAreaChartDefaultSettings();
            config1.expandFromLeft = true;
            config1.expandFromTop = true;
            config1.colorScale = d3.scale.category20b();
            config1.displayValueText = false;
            config1.maxValue = 100;

            var activity_to_desc = {
                1: "Contribution Received",
                2: "Cash Earnings",
                12: "Plan Transfer In",
                23: "Termination Distribution",
                24: "Miscellaneous Debit",
                25: "Withdrawal Distribution",
                59: "Plan Transfer Out"
            }
            var i = 1;
            for(var combo in combination) {
                config1.colorsScale = d3.scale.ordinal().range(["#235676"]);
                var split = combo.split('-'); // 0-tran 1-activity
                var data = [];
                var percent = (combination[combo] / transactions * 100).toFixed(1).toString();
                var obj = {
                    value: "100",
                    label: activity_to_desc[split[1]] + " (" + split[1] + ") : " + percent + "%"
                }
                data.push(obj);

                d3.select("#tran_display")
                    .append("svg")
                    .attr("id", "rectChartB" + i)
                    .attr("width", "100%")
                    .attr("height", "18px")
                loadRectangularAreaChart("rectChartB" + i++, data, config1);
            }
        });
    }
});
