"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const mongoosehelp_1 = require("./lib/mongoosehelp");
const youdaoCrawler_1 = require("./lib/youdaoCrawler");
const app = new Koa();
const router = new Router();
router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
})
    //返回查询结果，如果库中没有数据则从有道中获取，code{200：成功，201：有道成功,500:失败}
    .get('/getKeyWord', async (ctx) => {
    try {
        let key = ctx.request.query.key;
        let d = await mongoosehelp_1.default.getWord(key);
        ctx.set("Access-Control-Allow-Origin", "*");
        var result = {
            code: 500,
            data: {},
            errorMsg: ""
        };
        if (d == null) {
            console.log('db not find');
            let p = await youdaoCrawler_1.default.getyoudaoword(key);
            let savedata = youdaoCrawler_1.default.handleyoudao(p);
            if (savedata == null) {
                result.errorMsg = "有道数据获取失败";
                ctx.body = result;
            }
            else {
                let sr = await mongoosehelp_1.default.saveWord('info', savedata);
                d = await mongoosehelp_1.default.getWord(key);
                result.code = 201;
                result.data = d;
                ctx.body = result;
            }
        }
        else {
            result.code = 200;
            result.data = d;
            ctx.body = result;
        }
    }
    catch (e) {
        result.errorMsg = '服务异常:' + e;
        ctx.body = result;
    }
})
    .get('/getyoudao', async (ctx) => {
    try {
        let key = ctx.request.query.key;
        let d = await youdaoCrawler_1.default.getyoudaoword(key);
        let savedata = youdaoCrawler_1.default.handleyoudao(d);
        if (savedata == null) {
            ctx.body = "not find";
        }
        else {
            let sr = await mongoosehelp_1.default.saveWord(key, savedata);
            ctx.body = savedata;
        }
    }
    catch (e) {
        ctx.body = '服务异常:' + e;
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
    .post('/getAny', async (ctx) => {
    try {
        console.log(ctx.request.query);
        let data = ctx.request.query;
        let d = await mongoosehelp_1.default.getWords(data);
        ctx.body = d;
    }
    catch (e) {
        ctx.body = '服务异常:' + e;
    }
});
app.use(router.routes());
app.listen(3000);
console.log('localhost:3000');
//# sourceMappingURL=server.js.map