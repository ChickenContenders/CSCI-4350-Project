#!/bin/bash

sudo docker pull ${{ secrets.DOCKER_REPO_PATH }}/bucstop

sudo docker compose up --no-deps -d bucstop

sudo docker image prune -f
