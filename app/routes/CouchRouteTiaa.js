module.exports = function(router, nano) {
    var metric = nano.use('metrics');
    router.route('/couchmetrics')
        .post(function(req, res) {
            var doc = {
                "CATEGORY": req.body.CATEGORY,
                "SUB_CATEGORY": req.body.SUB_CATEGORY,
                "PLAN_NUMBER": req.body.PLAN_NUMBER,
                "TRN": req.body.TRN,
                "PART_SUB_PLAN": req.body.PART_SUB_PLAN,
                "TRADE_DATE": req.body.TRADE_DATE,
                "RUN_DATE": req.body.RUN_DATE,
                "TRAN_CODE": req.body.TRAN_CODE,
                "ACTIVITY": req.body.ACTIVITY,
                "FUND_IV": req.body.FUND_IV,
                "FUND_SRC": req.body.FUND_SRC,
                "CASH": req.body.CASH,
                "POST_NUM": req.body.POST_NUM,
                "SUB_ACTIVITY": req.body.SUB_ACTIVITY
            }

            metric.insert(doc, function(err, body) {
                if(!err) {
                    res.json({ message: 'Metric Created' });
                } else {
                    res.json({ message: 'Unable to Create Metric' });
                }
            });
        })

        .get(function(req, res) {
            metric.list({include_docs: true}, function(err, body) {
                if (!err) {
                    var array = [];
                    body.rows.forEach(function(ref) {
                        array.push(ref.doc);
                    });
                    res.json(array);
                } else {
                    res.json(err);
                }
            });
        });

    // query is just looping through. couldn't find a way to actually query
    router.route('/couchmetrics/query/:type/:key')
        .get(function(req, res) {
            if(req.params.type == 'TRN') { // query object with passed TRN
                metric.list({include_docs: true}, function(err, body) {
                    if (!err) {
                        var array = [];
                        body.rows.forEach(function(ref) {
                            if(ref.doc.TRN != parseInt(req.params.key)) {
                                return;
                            }
                            array.push(ref.doc);
                        });
                        res.json(array);
                    }
                });
            } else if(req.params.type == 'CATEGORY') { // query object with passed CATEGORY
                metric.list({include_docs: true}, function(err, body) {
                    if (!err) {
                        var array = [];
                        body.rows.forEach(function(ref) {
                            if(ref.doc.CATEGORY != req.params.key) {
                                return;
                            }
                            array.push(ref.doc);
                        });
                        res.json(array);
                    }
                });
            } else if(req.params.type == 'TRAN_CODE') { // query object with passed CATEGORY
                metric.list({include_docs: true}, function(err, body) {
                    if (!err) {
                        var array = [];
                        body.rows.forEach(function(ref) {
                            if(ref.doc.TRAN_CODE != req.params.key) {
                                return;
                            }
                            array.push(ref.doc);
                        });
                        res.json(array);
                    }
                });
            }
        });

    router.route('/couchmetrics/:tiaa_id/:tiaa_rev')
        .get(function(req, res) {
            metric.get(req.params.tiaa_id, function(err, body) {
                if(!err) {
                    res.json(body);
                } else {
                    res.json({ message: 'Unable to Select Metric' });
                }
            });
        })

        .put(function(req, res) {
            var doc = {
                _id: req.params.tiaa_id,
                _rev: req.params.tiaa_rev,
                "CATEGORY": req.body.CATEGORY,
                "SUB_CATEGORY": req.body.SUB_CATEGORY,
                "PLAN_NUMBER": req.body.PLAN_NUMBER,
                "TRN": req.body.TRN,
                "PART_SUB_PLAN": req.body.PART_SUB_PLAN,
                "TRADE_DATE": req.body.TRADE_DATE,
                "RUN_DATE": req.body.RUN_DATE,
                "TRAN_CODE": req.body.TRAN_CODE,
                "ACTIVITY": req.body.ACTIVITY,
                "FUND_IV": req.body.FUND_IV,
                "FUND_SRC": req.body.FUND_SRC,
                "CASH": req.body.CASH,
                "POST_NUM": req.body.POST_NUM,
                "SUB_ACTIVITY": req.body.SUB_ACTIVITY
            }

            metric.insert(doc, function(err, body) {
                if(!err) {
                    res.json({ message: 'Metric Updated' });
                } else {
                    res.json({ message: 'Unable to Update Metric' });
                }
            });
        })

        .delete(function(req, res) {
            metric.destroy(req.params.tiaa_id, req.params.tiaa_rev, function(err, body) {
                if(!err) {
                    res.json({ message: 'Metric Deleted' });
                } else {
                    res.json({ message: 'Unable to Delete Metric' });
                }
            });
        });
}
