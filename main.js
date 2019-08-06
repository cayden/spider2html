/**
 * Created by caydencui on 2019/8/6.
 */
var http = require('http')
var https = require('https')
var fs = require('fs');

// 要抓取的网页地址
var url = 'https://www.baidu.com'

https.get(url, function(res) {
    var html = ''
    res.on('data', function(data) {
        html += data;
    })
    res.on('end', function() {
        var imageUrl = html.find('.mess img').attr("src");
        console.log('imageUrl：'+imageUrl)
        // 将抓取的内容保存到本地文件中
        fs.writeFile('index.html', html, function(err) {
            if (err) {
                console.log('出现错误!')
            }
            console.log('已输出至index.html中')
        })
    })
}).on('error', function(err) {
    console.log('错误信息：' + err)
})
