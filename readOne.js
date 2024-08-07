#! /usr/bin/env node

"use strict";
const { Command } = require("commander");
var Crawler = require("crawler");
const inquirer = require("inquirer");
const fs = require("fs");
const program = new Command();

const baseUrl = "https://www.xxbiqudu.com/12_12492/";
let text = fs.createWriteStream("text.txt");

// program.command("init").action(() => {
//   inquirer
//     .prompt([
//       {
//         name: "chapter",
//         message: "chapter",
//       },
//     ])
//     .then((answers) => {
//       if (answers.chapter) {
//         getChapterCont(`${answers.chapter}.html`);
//       }
//     });
// });

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
          // text.write(`\n${title}\n`, function(err) {
          // })
          console.log(title);
          const content = $("#chaptercontent").text();
          console.log("--------------");
          console.log(content);
          // text.write(content, function(err) {
          //     console.log('ok')
          // })
        }
      },
    },
  ]);
}

const c = new Crawler();

getChapterCont("6113115.html");
// program.parse(process.argv);
