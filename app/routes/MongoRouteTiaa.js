var Metric = require('../models/metric');

module.exports = function(router) {
    router.route('/mongometrics')
        .post(function(req, res) {
            var metric = new Metric();

            metric.CATEGORY = req.body.CATEGORY;
            metric.SUB_CATEGORY = req.body.SUB_CATEGORY;
            metric.PLAN_NUMBER = req.body.PLAN_NUMBER;
            metric.TRN = req.body.TRN;
            metric.PART_SUB_PLAN = req.body.PART_SUB_PLAN;
            metric.TRADE_DATE = req.body.TRADE_DATE;
            metric.RUN_DATE = req.body.RUN_DATE;
            metric.TRAN_CODE = req.body.TRAN_CODE;
            metric.ACTIVITY = req.body.ACTIVITY;
            metric.FUND_IV = req.body.FUND_IV;
            metric.FUND_SRC = req.body.FUND_SRC;
            metric.CASH = req.body.CASH;
            metric.POST_NUM = req.body.POST_NUM;
            metric.SUB_ACTIVITY = req.body.SUB_ACTIVITY;

            metric.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Metric Created' });
            });
        })

        .get(function(req, res) {
            Metric.find(function(err, metrics) {
                if (err)
                    res.send(err);

                res.json(metrics);
            });
        });

    router.route('/mongometrics/query/:type/:key')
        .get(function(req, res) {
            if(req.params.type == 'TRN') {
                Metric.find({'TRN': req.params.key}, function(err, metrics) {
                    if (err)
                        res.send(err);
                    res.json(metrics);
                });
            } else if(req.params.type == 'CATEGORY') {
                Metric.find({'CATEGORY': req.params.key}, function(err, metrics) {
                    if (err)
                        res.send(err);
                    res.json(metrics);
                });
            } else if(req.params.type == 'TRAN_CODE') {
                Metric.find({'TRAN_CODE': req.params.key}, function(err, metrics) {
                    if (err)
                        res.send(err);
                    res.json(metrics);
                });
            }
        });

    router.route('/mongometrics/:tiaa_id')
        .get(function(req, res) {
            Metric.findById(req.params.tiaa_id, function(err, metric) {
                if (err)
                    res.send(err);
                res.json(metric);
            });
        })

        .put(function(req, res) {

            Metric.findById(req.params.tiaa_id, function(err, metric) {

                if (err)
                    res.send(err);

                metric.CATEGORY = req.body.tiaa_id.CATEGORY;
                metric.SUB_CATEGORY = req.body.tiaa_id.SUB_CATEGORY;
                metric.PLAN_NUMBER = req.body.tiaa_id.PLAN_NUMBER;
                metric.TRN = req.body.tiaa_id.TRN;
                metric.PART_SUB_PLAN = req.body.tiaa_id.PART_SUB_PLAN;
                metric.TRADE_DATE = req.body.tiaa_id.TRADE_DATE;
                metric.RUN_DATE = req.body.tiaa_id.RUN_DATE;
                metric.TRAN_CODE = req.body.tiaa_id.TRAN_CODE;
                metric.ACTIVITY = req.body.tiaa_id.ACTIVITY;
                metric.FUND_IV = req.body.tiaa_id.FUND_IV;
                metric.FUND_SRC = req.body.tiaa_id.FUND_SRC;
                metric.CASH = req.body.tiaa_id.CASH;
                metric.POST_NUM = req.body.tiaa_id.POST_NUM;
                metric.SUB_ACTIVITY = req.body.tiaa_id.SUB_ACTIVITY;

                metric.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Metric updated!' });
                });

            });
        })

        .delete(function(req, res) {
            Metric.remove({
                _id: req.params.tiaa_id
            }, function(err, metric) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });
}
