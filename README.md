# Build Notifier

Reads your build output from `stdin`, pipes it straight to `stdout` and notifies
you if the build passed or failed once an EOF is received.

It notifies you via [node-notifier](https://github.com/mikaelbr/node-notifier).

## Installation

```sh
npm install --save-dev build-notifier
```

## Usage

Use with JSCS:

```sh
jscs lib/**.js test/**.js | node_modules/.bin/notify -t JSCS
```

or with JSHint:

```sh
jshint lib/**.js test/**.js | node_modules/.bin/notify -t JSHint
```

or even better, in the `scripts` section of your `package.json`:

```json
{
  "scripts" : {
    "jscs": "jscs lib/**.js test/**.js | notify -t JSCS",
    "prehint": "npm -s run jscs",
    "hint": "jshint lib/**.js test/**.js | notify -t JSHint",
    "pretest": "npm -s run hint",
    "test": "your favorite test tool"
  }
}
```
