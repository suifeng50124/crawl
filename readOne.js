'use strict'

var Crawler = require("crawler");
const fs = require('fs');
const baseUrl = 'https://www.12zw.com/4/4417/';
let text = fs.createWriteStream('text.txt');

function getChapterCont (chapter) {

    c.queue([{
        uri: baseUrl + chapter,
        forceUTF8:true,
        callback: function(err, res, done) {
            if(err) {
                console.log('error:', err)
            } else {
                let $ = res.$;
                console.log(chapter+ '--------------')
                const title = $('h1').text();
                // text.write(`\n${title}\n`, function(err) {
                // })
                const content = $('#content').text();
                console.log('--------------')
                console.log(content)
                // text.write(content, function(err) {
                //     console.log('ok')
                // })
            }
        }
    }])
}

const c = new Crawler();

getChapterCont('2725952.html')