#!/bin/bash

docker run --rm --name keycloak-authz-client -p 8080:8080 "$@" \
  --mount type=tmpfs,destination=/opt/keycloak/data \
  -v "$(pwd)/.keycloak-data/import":/opt/keycloak/data/import \
  -e KEYCLOAK_ADMIN=admin@example.org \
  -e KEYCLOAK_ADMIN_PASSWORD=admin@example.org \
    quay.io/keycloak/keycloak:23.0.0 start-dev --import-realm --health-enabled=true
