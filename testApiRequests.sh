#!/bin/bash

echo "testing cheese"
curl -s -X GET "localhost:8081/products/barcode/5410396152934" | jq

echo "testing club-mate"
curl -s -X GET "localhost:8081/products/barcode/4029764001807" | jq

echo "testing water"
curl -s -X GET "localhost:8081/products/barcode/4100060012268" | jq

echo "testing tea"
curl -s -X GET "localhost:8081/products/barcode/4009300006350" | jq

echo "testing apples"
curl -s -X GET "localhost:8081/products/barcode/4024836432572" | jq

echo "testing bread"
curl -s -X GET "localhost:8081/products/barcode/4071800034805" | jq

echo "testing ice cream"
curl -s -X GET "localhost:8081/products/barcode/652729101133" | jq

echo "testing coke"
curl -s -X GET "localhost:8081/products/barcode/5449000000996" | jq

echo "testing juice"
curl -s -X GET "localhost:8081/products/barcode/858176002058" | jq

echo "testing nutella"
curl -s -X GET "localhost:8081/products/barcode/3017620422003" | jq

echo "testing nesquik"
curl -s -X GET "localhost:8081/products/barcode/3033710065967" | jq

echo "testing the peanut thing"
curl -s -X GET "localhost:8081/products/barcode/737628064502" | jq

echo "testing nicnacs"
curl -s -X GET "localhost:8081/products/barcode/4017100759000" | jq
