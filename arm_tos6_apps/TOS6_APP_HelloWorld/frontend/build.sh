#!/bin/bash

if [ -z "$(which git)" ]; then
	echo "please install git tools"
	exit 1
fi

if [ -z "$(which node)" ]; then
	echo "please install nodejs"
	exit 1
fi

if [ -z "$(which npm)" ]; then
	echo "please install npm"
	exit 1
fi

git pull origin tos5

npm i
npm run build

rm -f webui.bz2 >/dev/null 2>&1
tar -Jcvf webui.bz2 -C dist/ .
cp webui.bz2 ../output
