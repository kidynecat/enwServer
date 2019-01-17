"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
var wordgroupSchema = new Schema({
    name: String,
    trans: String
}, { _id: false });
var wordexampleSchema = new Schema({
    example: String,
    memo: String
}, { _id: false });
let wordSchema = new Schema({
    word: String,
    yinbiao: [String],
    fanyi: [String],
    rank: String,
    star: String,
    wordgroup: [wordgroupSchema],
    wordexample: [wordexampleSchema],
    wordhtml: String
});
wordSchema.index({ word: 1 });
let word = mongoose.model('word', wordSchema);
class Mgs {
    constructor() {
        mongoose.connect('mongodb://localhost/ENW');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('数据库已连接');
        });
    }
    async getWord(key) {
        let reg = new RegExp("^" + key + "$", "i");
        return await word.findOne({ word: reg }, 'word fanyi yinbiao rank star wordgroup');
    }
    async getWords(docu) {
        return await word.find(docu, 'word fanyi yinbiao rank star');
    }
    async saveWord(key, docu) {
        return await word.updateOne({ word: key }, docu, { upsert: true });
    }
}
exports.default = new Mgs();
//# sourceMappingURL=mongoosehelp.js.map