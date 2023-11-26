#!/usr/bin/env bash


zip -r builds/archive.zip "$PWD" \
    -x '*/.git/*' \
    -x '*/node_modules/*' \
    -x '*/builds/*' \
    -x '*/scripts/*' \
    -x '*/images/*' \
    -x '*/package.json' \
    -x '*/package-lock.json' \
    -x '*/puppeteer.js' \
    -x '*/.gitignore' \
    -x '*/main.html' \
    -x '*/main.js' \
    -x '*/manifest-local.json' \
    -x '*/close-tabs.js'
