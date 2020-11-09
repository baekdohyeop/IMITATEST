var mongoose = require('mongoose');
var utils = require('../utils/utils');

var subjects = [];
var units = [];

var problemSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    title: {type: String, },
    content: {type: String, },
    created_at: {type: Date, default: Date.now, },
    view_count: {type: Number, default: 0, },
    like_count: {type: Number, default: 0, },
    subject: {type: String, enum: subjects, },
    unit: {type: String, enum: units, },
    point: {type: Number, enum: [2, 3, 4], },
    number: {type: Number, },
    difficulty: {type: Number, },
    reviewer: {type: Number, default: 1, },
    answer_correct_count: {type: Number, default: 0, },
    submit_count: {type: Number, default: 0, },
    answer: {type: Number, },
    comments: [{
        author: {type: mongoose.Schema.Types.ObjectId, ref:'User',},
        content: {type: String, },
        created_at: {type: Date, default:Date.now,},
    }],
    problem_img_path:{type: String,},
});

problemSchema.methods = {
    saveProblem: function(callback) {
        var self = this;
        
        this.validate(function(err){
            if(err) return callback(err);

            self.save(callback);
        });
    },

    addComment: function(user, content, callback) {
        this.comments.push({
            content: content,
            author: user._id,
        });

        this.save(callback);
    },

    removeComment: function(id, callback) {
        var index = utils.indexOf(this.comments, {id:id});

        if(~index) {
            this.comments.splice(index, 1);
        } else {
            return callback('댓글 객체 없음');
        }
        this.save(callback);
    }
}

problemSchema.statics = {
    list: function(options, callback){
        var criteria = options.criteria || {};

        this.find(criteria).populate('author').sort({'created_at':-1}).limit(Number(options.perpage)).skip(options.perpage * options.page).exec(callback);
    }
}

module.exports = mongoose.model('Problem', problemSchema);

// 사진 : 
// 조회수 중복체크 : 1일마다 초기화 되는 DB에 사용자 ID 값, 게시글 ID 값을 저장해서 중복체크