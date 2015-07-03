///<reference path="../../../typings/tsd.d.ts"/>
import http = require('http')
import https = require('https')
import url = require('url')


interface HttpOptionsObject {
    host:string,
    path:string
}

export class HttpDownloader {
    
    constructor() {}
    
     /**
      * HTTP GET request
      * 
      * @param {string} anUrl
      * @param {function} callbackDone Called on the 'end' event
      * @param {function=} callbackData Called on each 'data' event
      */
    get(anUrl: string, 
        callbackDone: (body:string)=>any, 
        callbackData?: (chunk:string, progress:number)=>any) {
            
        var parsedUrl = url.parse(anUrl);
        console.log("HTTP-GET: %s", parsedUrl.toString());
        
        http.get(parsedUrl, function(response) {
            var body = '',
                totalBytes = response.headers["content-length"],
                downloadBytes = 0;

            response.on('data', function(chunk) {
                body += chunk;
                downloadBytes += chunk.length;
                if (callbackData) {
                    var progress = (downloadBytes / totalBytes) * 100;
                    callbackData(chunk, progress);
                }
            });

            response.on('end', function() {
                callbackDone(body);
            });
        });
    }
    
    /**
     * HTTPS GET request
     * 
     * @param {object} httpsOpts
     * @param {function} callbackDone Called on the 'end' event
     * @param {function=} callbackData Called on the 'data' event
     */
    gets(httpsOpts: HttpOptionsObject, 
        callbackDone: (body:string)=>any, 
        callbackData?: (chunk:string, progress:number)=>any) {
        console.log("HTTPS-GET: {host:%s, path:%s}", httpsOpts.host + httpsOpts.path);
        
        https.get(httpsOpts).on('response', function(response) {
            var body = '',
                totalBytes = response.headers["content-length"],
                downloadBytes = 0;

            response.on('data', function(chunk) {
                body += chunk;
                downloadBytes += chunk.length;
                if (callbackData) {
                    var $progress = (downloadBytes / totalBytes) * 100;
                    callbackData(chunk, $progress);
                }
            });

            response.on('end', function() {
                callbackDone(body);
            });
        });
    }

}
