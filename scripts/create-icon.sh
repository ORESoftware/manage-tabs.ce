#!/usr/bin/env bash

user_input="$1
"
if [[ -z "$1" ]]; then
  echo "Please enter a file to convert: "
  read user_input
fi


convert "$user_input" -resize '128x128' "images/$(basename "$user_input")"
