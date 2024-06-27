#!/bin/bash

until curl -sS "http://analytics:9200/_cat/health?h=status" | grep -q "green\|yellow"; do
    sleep 1
done

# `bookedAt` must be indexed in order to range on it
# `movieId` must be indexed in order to aggregate on it
curl -X PUT "http://analytics:9200/tickets" -H "Content-Type: application/json" -d'
{
    "mappings": {
        "properties": {
            "bookedAt": {
                "type": "date"
            },
            "movieId": {
                "type": "keyword"
            }
        }
    }
}'
