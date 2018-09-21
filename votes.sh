#!/usr/bin/env bash

arr[0]="5ba3ae10a745ea48ec7ee155"
arr[1]="5ba3ae10a745ea48ec7ee154"

RANDOM=$$$(date +%s)
for i in {1..20000}
do
 CANDIDATE=${arr[$RANDOM % ${#arr[@]}]}
 curl -X POST 'http://localhost:3000/votacao/5ba3ae10a745ea48ec7ee153/'$CANDIDATE
done
