#!/bin/sh

if [ -t 1 ]; then
	target="src/vfs_fonts.js"
else
	target="/dev/stdout"
fi

platform=`uname`

(
	echo "export default {"
	for file in "$@"; do
		file=$1
		filename=$(basename $file)
        if [[ $platform == "Linux" ]]; then
		    filecontent=$(base64 -w 0 $file)
        elif [[ $platform == "Darwin" ]]; then
		    filecontent=$(base64 -b 0 $file)
        else
            echo "Platfrom $platform Unknown!"
        fi
		shift
		echo "\"${filename}\":\"${filecontent}\""
		if [ "$#" -gt 0 ]; then
			echo ","
		fi
	done
	echo "};"
) > "$target"
