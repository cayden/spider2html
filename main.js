/**
 * Created by caydencui on 2019/8/6.
 */
var http = require('http')
var https = require('https')
var fs = require('fs');
var cheerio = require('cheerio')
var async = require('async')
var step = require('step')

// 要抓取的网页地址
var url = 'https://www.baidu.com'
var dst = "test.html"


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

function downImage(res, i, imgSrc) {
    var imgData = ''
    res.setEncoding('binary')
    res.on('data', function (chunk) {
        imgData += chunk;
    })
    var imgPath = __dirname + "/img" +"/" + i + "." + imgSrc.split(".").pop();
    // console.log(imgData);
    res.on("end", function () {
        console.log(imgPath);
        fs.writeFile( imgPath, imgData, "binary", function (err) {
            console.log(err);
        })
    })

    return imgPath
}

download(url, function (data) {
    if (data) {
        var $ = cheerio.load(data)
        var map = new Map();
        async.series([
                function (callback) {

                    $('img').each(function (i, elem) {
                        var imgSrc0 = $(this).attr('src')
                        var imgSrc = '';
                        if (!imgSrc0.startsWith("https") && !imgSrc0.startsWith("http")) {
                            imgSrc = "https:" + imgSrc0;
                        }
                        console.log('imgSrc:' + imgSrc)
                        if (imgSrc.startsWith("https")) {
                            https.get(imgSrc, function (res) {
                                var imgPath = downImage(res, i, imgSrc)
                                map.set(imgSrc0, imgPath)
                                console.log('imgSrc0:' + imgSrc0 + ',map:' + map.size)
                                if(i==1){
                                    callback(null, 'one');
                                }
                            })


                        } else if (imgSrc.startsWith("http")) {
                            http.get(imgSrc, function (res) {
                                var imgPath = downImage(res, i, imgSrc)
                                map.set(imgSrc0, imgPath)

                            })
                        }
                    })

                },
                function (callback) {
                    console.log('saveMap:' + map.size)
                    map.forEach(function(value, key){
                        console.log('key:' + key+',value'+value)
                        data= data.replace(key,value)
                    });

                    // for(var key in map)
                    // {
                    //     console.log('key:' + key+',map[key]'+map[key])
                    //     // alert(key+"-"+map[key]);
                    //     data.replace(key,map[key])
                    //
                    // }
                    // 将抓取的内容保存到本地文件中
                    fs.writeFile(dst, data, function (err) {
                        if (err) {
                            console.log('出现错误!')
                        }
                        console.log('已输出至' + dst + '中')
                        callback(null, 'two');
                    })

                }
            ],
            function (error, result) {
                console.log("error: ", error, "msg: ", result);
                if (error) {
                    console.log("error: ", error, "msg: ", result);
                }
                else {
                    console.log("方法执行完毕" + result);
                }
            }
        );


    }
})

//
// https.get(url, function(res) {
//     var html = ''
//     res.on('data', function(data) {
//         html += data;
//     })
//     res.on('end', function() {
//         var imageUrl = html.find('.mess img').attr("src");
//         console.log('imageUrl：'+imageUrl)
//         // 将抓取的内容保存到本地文件中
//         fs.writeFile('index.html', html, function(err) {
//             if (err) {
//                 console.log('出现错误!')
//             }
//             console.log('已输出至index.html中')
//         })
//     })
// }).on('error', function(err) {
//     console.log('错误信息：' + err)
// })
