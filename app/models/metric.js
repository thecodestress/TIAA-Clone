var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TiaaSchema   = new Schema({
    CATEGORY: { type: String },
    SUB_CATEGORY: { type: String },
    PLAN_NUMBER: { type: String },
    TRN: { type: Number },
    PART_SUB_PLAN: { type: String },
    TRADE_DATE: { type: String },
    RUN_DATE: { type: String },
    TRAN_CODE: { type: Number },
    ACTIVITY: { type: Number },
    FUND_IV: { type: String },
    FUND_SRC: { type: String },
    CASH: { type: Number },
    POST_NUM: { type: Number },
    SUB_ACTIVITY: { type: Number }
});

module.exports = mongoose.model('Metric', TiaaSchema);
