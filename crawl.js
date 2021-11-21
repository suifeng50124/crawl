'use strict'

var Crawler = require("crawler");
const fs = require('fs');
let book = {}
const baseUrl = 'https://www.12zw.la/2/2758/';
let text = fs.createWriteStream('text.txt');
let count = 0;

var c = new Crawler({
    maxConnections: 2000,
    // 在每个请求处理完毕后将调用此回调函数
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            book.chapters = [];
            // $ 默认为 Cheerio 解析器
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
            var $ = res.$;
            const title = $('#maininfo h1').text();
            book.title = title;
            const urls = $('#list a');
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                let obj = {};
                obj._url = $(url).attr('href') + "";
                obj.title = $(url).text();
                obj.num = obj._url.replace('.html', '');
                book.chapters.push(obj);
            }
            
            fs.writeFile(`books/${book.title}.json`, JSON.stringify(book, null, 4), () => {

            })

            // getChapterCont()
        }
        done();
    }
});

// 将一个URL加入请求队列，并使用默认回调函数
// c.queue(baseUrl);

// get chapter content
function getChapterCont () {

    let chapter = book.chapters[count]._url

    c.queue([{
        uri: baseUrl + chapter,
        rateLimit: 1000,
        forceUTF8:true,
        callback: function(err, res, done) {
            if(err) {
                console.log('error:', err)
            } else {
                let $ = res.$;
                console.log(chapter+ '--------------')
                const title = $('h1').text();
                text.write(`\n${title}\n`, function(err) {
                })
                const content = $('#content').text();
                text.write(content, function(err) {
                })
                if(count + 1 < book.chapters.length) {
                    count = count + 1;
                    getChapterCont()
                }
            }
        }
    }])
}

getChapterCont('https://www.12zw.la/2/2758/1417388.html')


console.log('ss')
