var mongoose = require('mongoose');
var utils = require('../utils/utils');

var testSchema = new mongoose.Schema({
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author: { type: String, },
    title: { type: String, },
    content: { type: String, },
    created_at: { type: Date, default: Date.now, },
    view_count: { type: Number, default: 0, },
    like_count: { type: Number, default: 0, },
    difficulty: {
        calculus: {type: Number, default: 0, },
        geometry_and_vector: {type: Number, default: 0, },
        probability_and_statistic: {type: Number, default: 0, },
    },
    reviews: [{
        writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
        content: { type: String, },
        difficulty: {
            calculus: { type: Number, default: 0, },
            geometry_and_vector: { type: Number, default: 0, },
            probability_and_statistic: { type: Number, default: 0, },
        },
        created_at: { type: Date, default: Date.now, },
    }],
    test_buy_path: { type: String, },
    test_img_path:{type:String, default: null, },
});

testSchema.methods = {
    saveTest: function(callback){
        var self = this;

        this.validate(function(err){
            if (err) return callback(err);

            self.save(callback);
        });
    },

    addReview: function(user, content, calculus, geometry_and_vector, probability_and_statistic, callback) {
        if(!this.difficulty.calculus || !this.difficulty.geometry_and_vector || !this.difficulty.probability_and_statistic){
            this.difficulty.calculus = calculus;
            this.difficulty.geometry_and_vector = geometry_and_vector;
            this.difficulty.probability_and_statistic = probability_and_statistic;
        } else {
            this.difficulty.calculus = (this.difficulty.calculus * this.reviews.length + calculus) / (this.reviews.length + 1);
            this.difficulty.geometry_and_vector = (this.difficulty.geometry_and_vector * this.reviews.length + geometry_and_vector) / (this.reviews.length + 1);
            this.difficulty.probability_and_statistic = (this.difficulty.probability_and_statistic * this.reviews.length + probability_and_statistic) / (this.reviews.length + 1);
        }

        this.reviews.push({
            writer: user._id,
            content: content,
            difficulty: {
                calculus: calculus,
                geometry_and_vector: geometry_and_vector,
                probability_and_statistic: probability_and_statistic,
            },
        });

        this.save(callback);
    },

    removeReview: function(id, callback) {
        var index = utils.indexOf(this.reviews, {id:id});

        if(~index) {
            if(this.reviews.length === 1){
                this.difficulty.calculus = 0;
                this.difficulty.geometry_and_vector = 0;
                this.difficulty.probability_and_statistic = 0;
            } else {
            var temp_difficulty = this.difficulty * this.reviews.length;
            temp_difficulty -= (this.reviews[index].calculus + this.reviews[index].geometry_and_vector + this.reviews[index].probability_and_statistic);
            temp_difficulty /= (this.reviews.length - 1);
            this.difficulty = temp_difficulty;
            }

            this.reviews.splice(index, 1);
        } else {
            return callback('리뷰 객체 없음');
        }
        this.save(callback);
    }
}

testSchema.statics = {
    list: function(options, callback){
        var criteria = options.criteria || {};

        this.find(criteria).populate('writer').sort({'created_at':-1}).limit(Number(options.perpage)).skip(options.perpage * options.page).exec(callback);
    }
}

module.exports = mongoose.model('Test', testSchema);