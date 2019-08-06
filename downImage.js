/**
 * Created by cuiran on 2019/8/6.
 */
var http = require('http')
var https = require('https')
var fs = require('fs')
var cheerio = require('cheerio')
var url = "https://www.baidu.com"


function download(url, callback) {
    https.get(url, function (res) {
        var data = ''
        res.on('data', function (chunk) {
            data += chunk
        })
        res.on('end', function () {
            callback(data)
        })
    }).on('error', function (err) {
        console.log(err);
    })
}

function downImage(res,i,imgSrc){
    var imgData = ''
    res.setEncoding('binary')
    res.on('data',function (chunk) {
        imgData += chunk;
    })
    // console.log(imgData);
    res.on("end", function () {
        var imgPath = "/" + i + "." + imgSrc.split(".").pop();
        console.log(imgPath);
        fs.writeFile(__dirname + "/img" + imgPath, imgData, "binary", function (err) {
            console.log(err);
        })
    })
}

download(url, function (data) {
    if (data){
        var $ = cheerio.load(data)
        $('img').each(function (i, elem) {
            var imgSrc = $(this).attr('src')

            if (!imgSrc.startsWith("https")&&!imgSrc.startsWith("http")) {
                imgSrc = "https:" + imgSrc;
            }
            console.log('imgSrc:'+imgSrc)
            if(imgSrc.startsWith("https")){
                https.get(imgSrc,function (res) {
                    downImage(res,i,imgSrc)
                })
            }else if(imgSrc.startsWith("http")){
                http.get(imgSrc,function (res) {
                    downImage(res,i,imgSrc)
                })
            }

        })
    }
})

