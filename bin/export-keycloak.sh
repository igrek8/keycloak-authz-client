#!/bin/bash

docker exec keycloak-authz-client /opt/keycloak/bin/kc.sh export \
  --dir /opt/keycloak/data/import
