#!/bin/bash

cloc --vcs=git . --not-match-f='package-lock\.json' > lines.txt
