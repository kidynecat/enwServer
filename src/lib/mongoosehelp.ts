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

let word = mongoose.model('word', wordSchema);

class Mgs{
    constructor(){
        mongoose.connect('mongodb://localhost/ENW');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('数据库已连接')
        });
    }

    public async getWord(key:string){
        let reg = new RegExp("^"+key +"$","i")
        return await word.findOne({word:reg},'word fanyi yinbiao rank star wordgroup wordexample')
    }

    public async getWords(docu:any){
        return await word.find(docu,'word fanyi yinbiao rank star')
    }

    public async saveWord( key:string,docu:any){
        return await word.updateOne({word:key},docu,{upsert:true})


        
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