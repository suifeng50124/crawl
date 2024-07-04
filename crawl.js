// spider

"use strict";

const Crawler = require("crawler");
const fs = require("fs");
const path = require("path");

let book = {};
const baseUrl = "https://www.xxbiqudu.com/12_12492/";

var c = new Crawler({
  maxConnections: 100, // 设置较小的连接数，避免写入内容的顺序问题
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      book.chapters = [];
      const $ = res.$;
      const title = $("#info h1").text();
      book.title = title;

      const textStream = fs.createWriteStream(
        path.join(__dirname, `${title}.txt`),
        {
          flags: "a",
        }
      );

      const urls = $("#list a");
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        let obj = {};
        obj._url = $(url).attr("href") + "";
        obj.title = $(url).text();
        obj.num = obj._url.replace(".html", "");
        book.chapters.push(obj);
        console.log("obj", obj);
      }

      // 保存目录JSON
      fs.writeFile(
        path.join(__dirname, `books/${book.title}.json`),
        JSON.stringify(book, null, 4),
        () => {
          console.log("JSON saved");
          // 根据目录读取内容，按顺序书写到文件
          writeChaptersSequentially(book.chapters, textStream);
        }
      );
    }
    done();
  },
});

c.queue(baseUrl);

function writeChaptersSequentially(chapters, textStream, index = 0) {
  if (index >= chapters.length) {
    console.log("All chapters written");
    textStream.end();
    return;
  }

  const chapter = chapters[index];
  getChapterContent(chapter, textStream, () => {
    writeChaptersSequentially(chapters, textStream, index + 1);
  });
}

function getChapterContent(obj, textStream, callback) {
  let url = obj._url;
  const chap = url.split("/");
  const chapter = chap[chap.length - 1];

  c.queue([
    {
      uri: baseUrl + chapter,
      forceUTF8: true,
      callback: function (err, res, done) {
        if (err) {
          console.log("chapter", chapter);
          console.log("error:", err);
        } else {
          let $ = res.$;
          const title = $("h1").text() + "\r\n";

          textStream.write(title, function (err) {
            if (err) {
              console.log("write err:", err);
            } else {
              console.log("Title written:", title);
            }
          });

          const content = $("#content")
            .html()
            ?.replace(/\<br\s*\/?\>/g, "\n");
          const data = $("#content").html(content)?.text();

          textStream.write(data ? data : "", function (err) {
            if (err) {
              console.log("write err:", err);
            } else {
              console.log("Content written for chapter:", chapter);
              done();
              callback();
            }
          });
        }
      },
    },
  ]);
}
