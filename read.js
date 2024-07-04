"use strict";

var Crawler = require("crawler");
const fs = require("fs");
// const baseUrl = 'https://www.xxbiqudu.com/9_9151/';
const baseUrl = "https://www.xxbiqudu.com/12_12492/";
let text = fs.createWriteStream("text.txt");

function getChapterCont(chapter) {
  c.queue([
    {
      uri: baseUrl + chapter,
      forceUTF8: true,
      callback: function (err, res, done) {
        if (err) {
          console.log("error:", err);
        } else {
          let $ = res.$;
          console.log(chapter + "--------------");
          const title = $("h1").text();
          console.log(title);
          // text.write(`\n${title}\n`, function(err) {
          // })
          const content = $("#content")
            .html()
            .replace(/\<br\s*\>/g, "\n");
          console.log("--------------");
          console.log($("#content").html(content).text());
          // text.write(content, function(err) {
          //     console.log('ok')
          // })
        }
      },
    },
  ]);
}

const c = new Crawler();

getChapterCont("6113145.html");
