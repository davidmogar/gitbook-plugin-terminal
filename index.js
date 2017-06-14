var XRegExp = require('xregexp');

function processLine(line, config) {
    var str = "";
    var commands = "";


    re = XRegExp(config.prompt);

    if(re.test(line)) {
        var parts = XRegExp.exec(line, re);
        str += `<span class="t-line t-prompt-line">`
        for(var i=0; i<re.xregexp.captureNames.length; i++) {
            var name = re.xregexp.captureNames[i];
            if(parts[name] != "") {
                str += `<span class="t-${name}">${parts[name]}</span>`
            }
        }
        str += '\n';

        if(config.copyButtons) {
            if(!parts.hasOwnProperty('command')) {
                throw Error("Cannot use copyButtons if command does not exist as a named group in the prompt regexp!");
            }
            commands += parts.command.replace(/"/g,'&quot;') + '\n';
        }
    } else {
        if(config.lineStyles && line.startsWith("[warning]")) {
            str += '<span class="t-line t-warning">';
            str += line.replace("[warning]","") + '\n';
        } else if (config.lineStyles && line.startsWith("[error]")) {
            str += '<span class="t-line t-error">';
            str += line.replace("[error]","") + '\n';
        } else {
            str += '<span class="t-line">';
            str += line + '\n';
        }
    }
    str += '</span>';


    return {"line":str, "command":commands};
}

function processBlock(block) {
    var book          = this;
    /* Make a copy */
    var orig_config   = Object.assign({}, book.config.get('pluginsConfig.term', {}));
    /* Merge dictionaries */
    var config        = Object.assign(orig_config, block.kwargs);

    var str =  `<pre class="term t-${config.style}${config.fade ? ' t-fade' : ''}">`;
    var body = block.body.trim().split('\n');
    var lines = "";
    var commands = ""
    for(i=0; i<body.length; i++) {
        var tmp = processLine(body[i], config);
        lines += tmp.line;
        commands += tmp.command;
    }

    /*Adding styles to button so that readmes look good*/
    var isweb = book.output.name == 'website';
    if(isweb && config.copyButtons && commands != "") {
        str += `<button class="btn t-copy" data-clipboard-text="${commands.trim()}"><svg class="octicon octicon-clippy" viewBox="0 0 14 16" version="1.1" width="14" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg></button>`
    }

    str += lines + '</pre>';
    return str;
}

module.exports = {

  website: {
    assets: './assets',
    js: [
      'plugin.js'
    css: [
      'plugin.css'
    ],
    js: [
      'clipboard.min.js',
      'initclip.js'
    ]
  },
  ebook: {
    assets: './assets',
    css: [
      'plugin.css'
    ]
  },
  blocks: {
      term: {
          process: processBlock
      },
      code: function(block) {
          console.warn("getting block " + block.kwargs.language);
          return;
      }
  }

};
