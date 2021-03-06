import * as mongoose from 'mongoose'

let Schema = mongoose.Schema;


var wordgroupSchema = new Schema({ 
    name: String ,
    trans: String
},{_id: false});

var wordexampleSchema = new Schema({ 
    example: String ,
    memo: String
},{_id: false});

let wordSchema = new Schema({
    word:String,
    yinbiao:[String],
    fanyi:[String],
    rank:String,
    star:String,
    wordgroup:[wordgroupSchema],
    wordexample:[wordexampleSchema],
    wordhtml:String
})
wordSchema.index({word:1})

var db = mongoose.createConnection('mongodb://localhost/ENW');
let word = db.model('word', wordSchema);


let oldwordSchema = new Schema({
    word:String,
    yinbiao:[String],
    fanyi:[String],
    rank:String,
    star:String,
    wordhtml:String
})
oldwordSchema.index({word:1})

var olddb = mongoose.createConnection('mongodb://localhost/Enword');
let oldword = olddb.model('word', oldwordSchema);

class Mgs{
    constructor(){
        
        //var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('数据库已连接')
        });

        olddb.on('error', console.error.bind(console, 'connection error:'));
        olddb.once('open', function() {
            console.log('老数据库已连接')
        });

    }

    public async getWord(key:string){
        let reg = new RegExp("^"+key +"$","i")
        return await word.findOne({word:reg},'word fanyi yinbiao rank star wordgroup wordexample')
    }

    public async getOldWords(docu:any){
        let oldDatas = await oldword.find(docu,'word wordhtml').skip(93).limit(1)
        return oldDatas

    }

    public async saveWord( key:string,docu:any){

        return await word.updateOne({word:key},docu,{upsert:true})
    }


    public async getOldWord(){

    }

    // public async addfield( conditions :any){

    //     let tmp = await word.find(conditions,'_id')

    //     tmp.forEach(async function(item){
    //         console.log(item.get("word"))
    //         let res = await word.updateOne({_id:item._id},{ $unset:{keyword:1}},{upsert:true})
    //     })

    //     //return await word.updateOne(conditions,docu,{upsert:true})
    // }

    
}

export default new Mgs()