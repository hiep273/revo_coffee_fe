# Run with Docker

## Start

From repo root:

```bash
docker compose up --build
```

## URLs

- Frontend (Vite): `http://localhost:5173`
- .NET API: `http://localhost:8080/weatherforecast`

## Notes

- The frontend container mounts `./revo-coffee-react` for live reload.
- `.NET` HTTPS redirect is disabled in docker via `DISABLE_HTTPS_REDIRECT=true`.

## Developer Quick Start

Windows (PowerShell):

```powershell
# Start both services with Docker Compose
docker compose up --build

# Or run frontend locally for fast iteration
cd revo-coffee-react
npm install
npm run dev
```

Unix / macOS (bash):

```bash
# Start both services with Docker Compose
docker compose up --build

# Or run frontend locally for fast iteration
cd revo-coffee-react
npm install
npm run dev
```

## Verification Commands

Check compose configuration and start services detached:

```bash
docker compose -f docker-compose.yml config
docker compose -f docker-compose.yml up --build -d
docker ps --filter "name=frontend" --filter "name=dotnet-api"
```

## Troubleshooting

- If the frontend fails to start, ensure Node.js is installed and dependencies are installed in `revo-coffee-react`.
- If the backend fails, check `be_revo_coffee/` Dockerfile and appsettings for ports and environment variables.

