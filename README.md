# Terminal plugin for GitBook

Take it easy. This is not a real terminal. The aim of this plugin is to simulate a terminal in which there is a line for the prompt and the command, and multiple lines for the output.

So... why you should use it? It's way easier to catch the attention of your users when the code block looks fancy, isn't it?

## Cool, can I see it working?

The next animated gif shows all the styles you can use:

![terminal themes](https://github.com/davidmogar/gitbook-plugin-terminal/blob/resources/images/themes.gif?raw=true)

## How can I use this plugin?

You only have to edit your book.json and modify it adding something like this:

```json
"plugins" : [ "terminal" ],
```

This will set up everything for you. If you want some more control over the behaviour or the style of your terminal, just add this section too:

```json
"pluginsConfig": {
  "terminal": {
    "copyButtons": false,
    "fade": false,
    "style": "classic",
  }
}
```

The following are valid options for either for a block in block mode or the config file:

| Option        | Default        | Description                          |
| ------------- | -------------- | ------------------------------------ |
| `fade`        | `true`         | Fade non-input parts on hover        |
| `copyButtons` | `true`         | Add the copy button                  |
| `style`       | `"default"`    | Pick the style (based on terminal)   |
| `prompt`      | regexp (below) | The string to search for and replace in block mode |
| `linestyles`  | `false`        | Add per line styles in block mode    |


## New block based auto-colorization

The block based system using the GitBook block system and the keyword `terminal`. A named-group regular expression picks up the parts of your command line, and can be modified either in your defaults or per-block. This works in all backends, including the GitBook readme (json backend). When using this method, one copy button will be created that copies all commands.

The [regular expression](https://github.com/slevithan/xregexp/blob/master/README.md#usage-examples) that is used by default is:

```
"(?<prompt>[^\\$^#^:]*)(?<pathsep>:?)(?<path>[^\\$^#]*?)(?<delimiter>[\\$#] )(?<command>.*)$"
```

The only requirement is that a named group "`command`" exist if you use copyButtons. The others are iterated in order and added as `t-name` spans. This default looks form something like `prompt:path$ command` (or `#`).
You use it like this:

```
{% terminal lineStyles=true %}
foo@joe:~ $ ./myscript
Normal output line. Nothing special here...
But...
You can add some colors. What about a warning message?
[warning][WARNING] The color depends on the theme. Could look normal too
What about an error message?
[error][ERROR] This is not the error you are looking for
```




## Classic token method (website only)

Now, to define your terminal you will have to create a Markdown code block where the first line will contain the token `**[terminal]` and after that, the text for the terminal.

The whole list of tokens is defined here:

* **command**: Command "executed" in the terminal.
* **delimiter**: Sequence of characters between the prompt and the command.
* **error**: Error message.
* **path**: Directory path shown in the prompt.
* **prompt**: Prompt of the user.
* **warning**: Warning message.

The next example shows how to use all of them:
<pre><code>
```
**[terminal]
**[prompt foo@joe]**[path ~]**[delimiter  $ ]**[command ./myscript]
Normal output line. Nothing special here...
But...
You can add some colors. What about a warning message?
**[warning [WARNING] The color depends on the theme. Could look normal too]
What about an error message?
**[error [ERROR] This is not the error you are looking for]
```
</pre></code>

So, as you can see, a token will be something like `**[token value]` where value can be any text.

## So, what is the actual list of styles?

Terminal has 6 styles:

* **default**: Looks just like normal GitBook. Until you hover.
* **black**: Just that good old black terminal everybody loves.
* **classic**: Looking for green color font over a black background? This is for you.
* **flat**: Oh, flat colors. I love flat colors. Everything looks modern with them.
* **ubuntu**: Admit it or not, but Ubuntu have a good looking terminal.
* **white**: Make your terminal to blend in with your GitBook.

## Is there anything else I can customize?

Sure! As you can see in the previous examples, there are two more options:

* **copyButtons**: If enabled, handy copy button will appear next to the commands. On click, the command will be copied to the clipboard. (All commands in block in block mode)
* **fade**: When enabled, every time the cursor is over the terminal, the text will be fade out to highlight the command.

