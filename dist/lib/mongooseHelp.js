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
var db = mongoose.createConnection('mongodb://localhost/ENW');
let word = db.model('word', wordSchema);
let oldwordSchema = new Schema({
    word: String,
    yinbiao: [String],
    fanyi: [String],
    rank: String,
    star: String,
    wordhtml: String
});
oldwordSchema.index({ word: 1 });
var olddb = mongoose.createConnection('mongodb://localhost/Enword');
let oldword = olddb.model('word', oldwordSchema);
class Mgs {
    constructor() {
        //var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('数据库已连接');
        });
        olddb.on('error', console.error.bind(console, 'connection error:'));
        olddb.once('open', function () {
            console.log('老数据库已连接');
        });
    }
    async getWord(key) {
        let reg = new RegExp("^" + key + "$", "i");
        return await word.findOne({ word: reg }, 'word fanyi yinbiao rank star wordgroup wordexample');
    }
    async getOldWords(docu) {
        let oldDatas = await oldword.find(docu, 'word wordhtml').skip(93).limit(1);
        return oldDatas;
    }
    async saveWord(key, docu) {
        return await word.updateOne({ word: key }, docu, { upsert: true });
    }
    async getOldWord() {
    }
}
exports.default = new Mgs();
//# sourceMappingURL=mongoosehelp.js.map