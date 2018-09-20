#!/usr/bin/env bash

arr[0]="5ba307467bbe14299c61db55"
arr[1]="5ba307467bbe14299c61db54"

RANDOM=$$$(date +%s)
for i in {1..1000}
do
 CANDIDATE=${arr[$RANDOM % ${#arr[@]}]}
 curl -X POST 'http://localhost:3000/votacao/5ba307467bbe14299c61db53/'$CANDIDATE
done
