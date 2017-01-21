var firebase = require('firebase');
var url = 'https://blinding-heat-7423.firebaseio.com/metrics';

module.exports = function(router) {
    router.route('/firebasemetrics')
        .post(function(req, res) {
            var ref = new Firebase(url);

            var onComplete = function(error) {
                if(error) {
                    res.json({ message: 'Unable to Push Metric' });
                } else {
                    res.json({ message: 'Metric Created' });
                }
            };

            ref.push(
                {
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
                },
                onComplete
            );
        })

        .get(function(req, res) {
            var ref = new Firebase(url);
            ref.once('value', function(snap) {
                res.json(snap.val());
            });
        });

    router.route('/firebasemetrics/query/:type/:key')
        .get(function(req, res) {
            var ref = new Firebase(url);
            if(req.params.type == 'TRN') { // query object with passed TRN
                ref.orderByChild('TRN').equalTo(parseInt(req.params.key)).once('value', function(snap) {
                    var array = [];
                    snap.forEach(function(childSnap) {
                        array.push(childSnap.val());
                    });
                    res.json(array);
                });
            } else if(req.params.type == 'CATEGORY') { // query object with passed CATEGORY
                ref.orderByChild('CATEGORY').equalTo(req.params.key).once('value', function(snap) {
                    var array = [];
                    snap.forEach(function(childSnap) {
                        array.push(childSnap.val());
                    });
                    res.json(array);
                });
            } else if(req.params.type == 'TRAN_CODE') { // query object with passed CATEGORY
                ref.orderByChild('TRAN_CODE').equalTo(parseInt(req.params.key)).once('value', function(snap) {
                    var array = [];
                    snap.forEach(function(childSnap) {
                        array.push(childSnap.val());
                    });
                    res.json(array);
                });
            }
        });

    router.route('/firebasemetrics/:tiaa_id')
        .get(function(req, res) {
            var ref = new Firebase(url + '/' + req.params.tiaa_id);
            ref.once('value', function(snap) {
                res.json(snap.val());
            });
        })

        .put(function(req, res) {
            var ref = new Firebase(url + '/' + req.params.tiaa_id);

            var onComplete = function(error) {
                if(error) {
                    res.json({ message: 'Unable to Update Metric' });
                } else {
                    res.json({ message: 'Metric Updated!' });
                }
            };

            ref.update(
                {
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
                },
                onComplete
            );
        })

        .delete(function(req, res) {
            var ref = new Firebase(url + '/' + req.params.taxi_id);

            var onComplete = function(error) {
                if(error) {
                    res.json({ message: 'Unable to Delete Metric' });
                } else {
                    res.json({ message: 'Successfully deleted' });
                }
            };

            ref.remove(onComplete);
        });
}
