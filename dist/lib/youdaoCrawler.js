"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const http = require("http");
class youdaoCrawler {
    constructor() {
    }
    async getyoudaoword(keyword) {
        const options = {
            hostname: 'www.youdao.com',
            port: 80,
            path: '/w/' + keyword,
            method: 'GET',
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36'
            }
        };
        return new Promise((resolve, reject) => {
            let resbody = "";
            const req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    //console.log(`BODY: ${chunk}`);
                    resbody += chunk;
                });
                res.on('end', () => {
                    //console.log('No more data in response.');
                    resolve(resbody);
                });
            });
            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                reject(`problem with request: ${e.message}`);
            });
            //req.write(postData);
            req.end();
        });
    }
    handleyoudao(htmlbody) {
        let $ = cheerio.load(htmlbody);
        let yinbiaoArray = [];
        let fanyiArray = [];
        let wordgroupArray = [];
        let wordexampleArray = [];
        let savedata = {
            word: "",
            yinbiao: yinbiaoArray,
            fanyi: fanyiArray,
            rank: "",
            star: "",
            wordgroup: wordgroupArray,
            wordexample: wordexampleArray,
            wordhtml: htmlbody
        };
        try {
            savedata.word = $(".keyword").html();
            if (savedata.word == null) {
                console.log('not find');
                return null;
            }
            // if( $(".error-typo").html() != null)
            // {
            //     console.log('not find')
            //     return null
            // }
            $('.baav .phonetic').each(function () {
                savedata.yinbiao.push($(this).text());
            });
            $('.trans-container').first().children().children().each(function () {
                savedata.fanyi.push($(this).text());
            });
            if ($('.star').length > 0) {
                savedata.star = $('.star').attr('class').substring(5);
            }
            if ($('.rank').length > 0) {
                savedata.rank = $('.rank').text();
            }
            $('#wordGroup .wordGroup').each(function () {
                let n = $(this).children().text();
                let t = this.lastChild;
                savedata.wordgroup.push({ name: $(this).children().text(), trans: this.lastChild.nodeValue.replace(/^\s+|\s+$/g, "") });
            });
            $('#bilingual .ol').children().each(function () {
                let example = $(this).children().eq(0).text().replace(/^\s+|\s+$/g, "");
                let memo = $(this).children().eq(1).text().replace(/^\s+|\s+$/g, "");
                savedata.wordexample.push({ example: example, memo: memo });
            });
            $('#originalSound .ol').children().each(function () {
                let example = $(this).children().eq(0).text().replace(/^\s+|\s+$/g, "");
                let memo = $(this).children().eq(1).text().replace(/^\s+|\s+$/g, "");
                savedata.wordexample.push({ example: example, memo: memo });
            });
            $('#authority .ol').children().each(function () {
                let example = $(this).children().eq(0).text().replace(/^\s+|\s+$/g, "");
                let memo = $(this).children().eq(1).text().replace(/^\s+|\s+$/g, "");
                savedata.wordexample.push({ example: example, memo: memo });
            });
        }
        catch (e) {
            console.log(e);
            return null;
        }
        console.log(savedata);
        return savedata;
    }
}
exports.default = new youdaoCrawler();
//# sourceMappingURL=youdaoCrawler.js.map