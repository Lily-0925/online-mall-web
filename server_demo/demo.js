let http = require("http");
let url = require("url");
let util = require("util");
let fs = require("fs");

let server = http.createServer((req,res)=>{
    var pathname = url.parse(req.url).pathname;
    // console.log("file"+pathname.substring(1))
    fs.readFile(pathname.substring(1),(err,data)=>{
        if(err){
            res.writeHead(404,{
                'Content-Type':'text/Html'
            });
        }else{
            res.writeHead(200,{
                'Content-Type':'text/Html'
            });

        res.write(data.toString());
        }

        res.end();
    });
});

server.listen(3000,"127.0.0.1",()=>{
    console.log("请打开'127.0.0.1:3000'");
})









