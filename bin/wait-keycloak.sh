function health() {
  curl -s http://localhost:8080/health/ready | jq -r '.status'
}

while [[ $(health) != 'UP' ]]; do
  echo "Waiting for Keycloak to start..."
  sleep 2
done

echo "Keycloak is ready."