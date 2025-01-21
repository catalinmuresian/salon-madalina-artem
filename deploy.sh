#!/usr/bin/env sh


quasar build

git add .

git commit -m 'deploy'

git push
