#!/bin/bash

docker exec keycloak-authz-client /opt/keycloak/bin/kc.sh import \
  --dir /opt/keycloak/data/import \
  --override=true