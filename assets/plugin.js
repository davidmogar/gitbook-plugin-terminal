require(['gitbook', 'jQuery'], function(gitbook, $) {

  const TERMINAL_HOOK = '**[terminal]'

  var pluginConfig = {};
  var regex = /\*\*\[(command|delimiter|error|prompt|warning) ((?:[^\]]+|\](?!\*\*|$)|)+)]/

  function initializePlugin(config) {
    pluginConfig = config.terminal;
  }

  function format_terminal_block(block) {
    block.parent('pre').addClass('terminal terminal-' + pluginConfig.style);
    text = block.html().replace(TERMINAL_HOOK + '\n', '');
    block.html(parse_tokens(text));
    $('body').append('<textarea id="terminal" />');
  }

  function parse_tokens(text) {
    return text.replace(new RegExp(regex, 'gm'), function(match, token, value) {
      return '<span class="terminal-' + token + '">' + value + '</span>';
    });
  }

  gitbook.events.bind('start', function(e, config) {
    initializePlugin(config);
  });

  gitbook.events.bind('page.change', function() {
    $('code:contains(' + TERMINAL_HOOK + ')').each(function() {
      format_terminal_block($(this));
    });
  });

});
