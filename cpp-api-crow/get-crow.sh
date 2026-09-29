#!/bin/bash
set -e

git clone --depth 1 https://github.com/CrowCpp/Crow.git /tmp/crow
mkdir -p include
cp -r /tmp/crow/include/* include/
rm -rf /tmp/crow
