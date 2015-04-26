# Build Notifier

Takes input from `stdin`, pipes it straight to `stdout`. Once an EOF is received
it notifies the user via (node-notify)[https://github.com/mikaelbr/node-notifier]
depending on the output of the piped-in command.
