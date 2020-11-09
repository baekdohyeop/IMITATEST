var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true },
    submit_count: { type: Number, default: 0},
    level : {
        calculus: {type: Number, default: -1},
        geometry_and_vector: {type: Number, default: -1},
        probability_and_statistic: {type:Number, default: -1},
    },
    evaluateproblems:[{
        problem: { type: mongoose.SchemaTypes.ObjectId, ref : 'Problem'},
        difficulty : {type: Number, },
    }],
    postproblems: [{
        problem: { type: mongoose.SchemaTypes.ObjectId, ref:'Problem'},
    }],
    solveproblems: [{
        problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem'}
    }],
    solveproblems_count: { type: Number, default: 0},
    solvingproblems: [{
        problem: {type: mongoose.Schema.Types.ObjectId, ref:'Problem'}
    }],
    likeproblems: [{
        problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem'}
    }],
    liketests:[{
        test: { type: mongoose.Schema.Types.ObjectId, ref:'Test'},
    }],
    solvetests: [{
        test: {type: mongoose.Schema.Types.ObjectId, ref:'Test'},
    }],
    curriculum: [{
        custom : { type : Boolean, },
        test : { type: mongoose.Schema.Types.ObjectId, ref : 'Test'},
        difficulty : {type: Number, },
    }],
    curriculum_level: {
        calculus: { type: Number},
        geometry_and_vector: {type:Number},
        probability_and_statistic: {type: Number},
    },
});

userSchema.methods = {
    authenticate : function (password) {
        if (password === this.password) {
            return true;
        } else {
            return false;
        }
    },

    saveUser : function(callback){
        var self = this;
        self.solveproblems_count = self.solveproblems.length;
        this.validate(function(err){
            if(err) return callback(err);

            self.save(callback);
        });
    }
}

userSchema.statics = {
    rank: function(callback){
        this.find().sort({solveproblems_count:-1, submit_count:1}).limit(10).exec(callback);
    }
}

module.exports = mongoose.model('User', userSchema);