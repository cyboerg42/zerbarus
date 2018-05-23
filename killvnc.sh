#/bin/bash
#it's a dirty hack - i know... need to fix!

s=$(echo $(ps -aux | grep $1 | grep "sh -c"))
A="$(cut -d$' ' -f2 <<<"$s")"
kill "$A"
s=$(echo $(ps -aux | grep $1 | grep "bash"))
A="$(cut -d$' ' -f2 <<<"$s")"
kill "$A"

