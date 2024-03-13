#!/bin/sh

# Source env vars.
. .env

docker run \
    --rm \
    --name reference \
    --entrypoint npm \
    -e REF_URI=${REF_URI} \
    -e REF_UID=${REF_UID}\
    -v "$(pwd)/data:/srv/data" \
    -v "$(pwd)/config:/srv/config" \
    -w /srv \
  public.ecr.aws/unocha/vrt:debian-20-chromium-dev \
    run reference-auth

docker run \
    --rm \
    --name test \
    --entrypoint npm \
    -e TEST_URI=${TEST_URI}\
    -e TEST_UID=${TEST_UID} \
    -v "$(pwd)/data:/srv/data" \
    -v "$(pwd)/config:/srv/config" \
    -w /srv \
  public.ecr.aws/unocha/vrt:debian-20-chromium-dev \
    run test-auth
