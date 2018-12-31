var mdlint = require('markdownlint');
var glob = require('glob');
// var path = require('path');
var clc = require("cli-color");

function doLint(files) {
  const options = {
    files,
    config: require('../.markdownlint.json')
  }
  // console.log(options);
  mdlint(options, function callback(err, result) {
    if (!err) {
      printResult(result);
      // console.dir(result, { "colors": true, "depth": null });
    }
  });
}

glob('@(rokid-homebase-docs|smarthome)/**/*.md', {
  nodir: true,
  ignore: ['_book', 'node_modules', 'scripts']
}, (error, files) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  doLint(['README.md', 'SUMMARY.md'].concat(files))
  
})

function printResult(result) {
  const files = Object.keys(result);
  let total = 0;
  files.forEach(file => {
    const fullPath = './' + file
    const d = result[file]
    total += d.length;
    
    if (d && d.length) {
      console.error(clc.red(`File ${fullPath}:`))
      d.forEach(issue => {
        console.error(`  > ${issue.ruleNames[0]} ${fullPath}:${issue.lineNumber}`)
        console.error(`    ${issue.ruleDescription}: ${issue.errorDetail}`)
      })
      console.error(`  ${d.length} issues found for this file.`);
    } else {
      console.error(clc.green(`File ${fullPath}: PASS`))
    }
  })
  console.error(`\nFound ${total} Issues in ${files.length} Files.`)
  if (total > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}


