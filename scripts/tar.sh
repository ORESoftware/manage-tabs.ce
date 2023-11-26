#!/usr/bin/env bash


tar -cvf builds/archive.tar \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='builds' \
  --exclude='scripts' \
  --exclude='images' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  --exclude='puppeteer.js' \
  --exclude='main.js' \
  --exclude='close-tabs.js' \
  "$PWD"