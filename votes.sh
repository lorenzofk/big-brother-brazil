#!/usr/bin/env bash

arr[0]="5ba39ce0cbb1b33226f5da38"
arr[1]="5ba39ce0cbb1b33226f5da37"

RANDOM=$$$(date +%s)
for i in {1..500000}
do
 CANDIDATE=${arr[$RANDOM % ${#arr[@]}]}
 curl -X POST 'http://localhost:3000/votacao/5ba39ce0cbb1b33226f5da36/'$CANDIDATE
done
