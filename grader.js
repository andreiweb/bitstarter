#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var request = require('request');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioURLFile = function(urlfile) {

request(urlfile, function(err, resp, body){
    return cheerio.load(body);
});

};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkURL = function(url, checksfile) {

    request(url, function(err, resp, body){
     $ = cheerio.load(body);

//    links = $('.about'); //use your CSS selector here

//    console.log($(links).length);


     var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }

    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);

    });

}

var checkDOM = function(htmlFile, checksfile) {
    $ = cheerioHtmlFile(htmlFile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }

    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);

};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('--checks, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('--file, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('--url, --url <url>', 'Path to url', String)
        .parse(process.argv);

if (program.url != undefined) {
checkURL(program.url, program.checks);
}
else {

     checkDOM(program.file, program.checks);
}
    //checkURL(program.url, program.checks);

/*    var checkJson = checkDOM($, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
*/

} else {
    exports.checkHtmlFile = checkHtmlFile;
}