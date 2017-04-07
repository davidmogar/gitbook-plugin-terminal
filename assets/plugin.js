require(['gitbook', 'jQuery'], function(gitbook, $) {

  const TERMINAL_HOOK = '**[terminal]'

  var pluginConfig = {};
  var regex = /\*\*\[(command|delimiter|error|path|prompt|warning) ((?:[^\]]+|\](?!\*\*|$)|)+)]/
  var timeout;

  function addCopyElements(block) {
    button = $('<i id="terminal-copy" class="fa fa-clone"></i>');
    button.click(copyCommand);
    block.append(button);

    $('body').append('<textarea id="terminal-textarea" />');
  }

  function copyCommand() {
    kbdCommand = $('kbd.terminal-command');
    textarea = $('#terminal-textarea');
    textarea.val(kbdCommand.text());
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    kbdCommand.focus();
    updateCopyButton();
  }

  function initializePlugin(config) {
    pluginConfig = config.terminal;
  }

  function format_terminal_block(block) {
    pre = block.parent('pre')
    pre.addClass('terminal terminal-' + pluginConfig.style);

    if (pluginConfig.fade) {
      pre.addClass('terminal-fade');
    }

    /* Get text and remove hook */
    text = block.html().replace(TERMINAL_HOOK + '\n', '');
    block.html(parse_tokens(text));

    if (pluginConfig.copyButton) {
      addCopyElements(block);
    }
  }

  function parse_tokens(text) {
    return text.replace(new RegExp(regex, 'gm'), function(match, token, value) {
      element = null;

      if (token == 'command') {
        element = '<kbd class="terminal-' + token + '">' + value + '</kbd><tt>';
      } else {
        element = '<span class="terminal-' + token + '">' + value + '</span>';
      }

      return element;
    }) + '</tt>';
  }

  function updateCopyButton() {
    $('#terminal-copy').removeClass('fa-clone').addClass('fa-check');
    clearTimeout(timeout);
    timeout = window.setTimeout(function() {
      $('#terminal-copy').removeClass('fa-check').addClass('fa-clone');
    }, 1000);
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
