#!/bin/bash

sudo docker pull ${{ secrets.DOCKER_REPO_PATH }}/gamemicro

sudo docker compose up --no-deps -d micro

sudo docker image prune -f
