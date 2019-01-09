"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
var wordgroupSchema = new Schema({
    name: String,
    trans: String
});
let wordSchema = new Schema({
    word: String,
    yinbiao: [String],
    fanyi: [String],
    rank: String,
    star: String,
    wordgroup: [wordgroupSchema],
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
    async addfield(conditions) {
        let tmp = await word.find(conditions, '_id');
        tmp.forEach(async function (item) {
            console.log(item.get("word"));
            let res = await word.updateOne({ _id: item._id }, { $unset: { keyword: 1 } }, { upsert: true });
        });
        //return await word.updateOne(conditions,docu,{upsert:true})
    }
}
exports.default = new Mgs();
//# sourceMappingURL=mongoosehelp.js.map