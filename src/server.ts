import * as Koa from 'koa';
import * as Router from 'koa-router';
import Mgs from './lib/mongoosehelp'
import youdao from './lib/youdaoCrawler'
import { Agent } from 'http';

const app = new Koa();
const router = new Router();



router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
})
//返回查询结果，如果库中没有数据则从有道中获取，code{200：成功，201：有道成功,500:失败}
.get('/getKeyWord', async (ctx) => {
    try
    {
        let key = encodeURI(ctx.request.query.key)
        let d = await Mgs.getWord(key);
        ctx.set("Access-Control-Allow-Origin","*")

        var result ={
            code:500,
            data:{},
            errorMsg:""
        }


        if(d == null)
        {
            console.log('db not find')

            let p = await youdao.getyoudaoword(key)
            let savedata = youdao.handleyoudao(p)

            if(savedata == null)
            {
                result.errorMsg = "有道数据获取失败"

                ctx.body = result
            }
            else
            {
                let sr = await Mgs.saveWord('info',savedata)
                d = await Mgs.getWord(key);


                result.code = 201
                result.data = d
                ctx.body = result
            }
        }
        else
        {
            result.code = 200
            result.data = d
            ctx.body = result;
        }
    }
    catch(e)
    {
        result.errorMsg = '服务异常:' + e
        ctx.body = result
    }
})
.get('/getyoudao', async (ctx) => {
    try
    {
        let key = encodeURI(ctx.request.query.key)
        let d = await youdao.getyoudaoword(key)
        let savedata = youdao.handleyoudao(d)

        if(savedata == null)
        {
            ctx.body = "not find"
        }
        else
        {
            let sr = await Mgs.saveWord(key,savedata)
            ctx.body = savedata
        }
    }
    catch(e)
    {
        ctx.body = '服务异常:' + e
    }
})

.get('/getOldData', async (ctx) => {
    try
    {

        //取出老库单词
        

        //保存之新库

        //youdao.handleyoudao()
    }
    catch(e)
    {
        ctx.body = '服务异常:' + e
    }
})

// .get('/addfield',async (ctx) => {
//     try
//     {
//         let sr = await Mgs.addfield({star:{$ne:'9999'}})

        
//     }
//     catch(e)
//     {
//         ctx.body = '服务异常:' + e
//     }
// })

//为老字典增加新字段功能
.post('/reflashOldData', async (ctx) => {
    try
    {
        console.log(ctx.request.query)

        //读取老字典库
        let data = {star:{$eq:''}}
        let d = await Mgs.getOldWords(data);

        //处理后插入新字典库
        //let result:any[]=[];
        // d.forEach(async olddata => {
        //     result.push(youdao.handleyoudao(olddata.toObject().wordhtml))
        //     let oldwordname = olddata.toObject().word
        //     let resulttmp = youdao.handleyoudao(olddata.toObject().wordhtml)

        //     let sr = await Mgs.saveWord(oldwordname,resulttmp)

        //     console.log(sr)
        // });

        for(let i = 0;i<d.length;i++)
        {
            let oldwordname = d[i].toObject().word
            try
            {
            
            let resulttmp = youdao.handleyoudao(d[i].toObject().wordhtml)


            let sr = await Mgs.saveWord(oldwordname,resulttmp)
            console.log( (i+1)+'条：' +sr)

            }
            catch(ex){
                console.log( (i+1)+'条：异常 ' + oldwordname + ';' + ex)
            }
            
        }

        ctx.body = '正在从老库中处理数据到新库';
    }
    catch(e)
    {
        ctx.body = '服务异常:' + e
    }
})

app.use(router.routes());

app.listen(3000);

console.log('localhost:3000');
