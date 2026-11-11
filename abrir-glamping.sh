#!/usr/bin/env bash
# Abre el planificador del Glamping en Linux (y también en Mac).
# Uso:  bash abrir-glamping.sh

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo
  echo "Hace falta Node.js para abrir la app."
  echo "Mira la guía: COMO-ABRIR-EN-LINUX.md (apartado «Paso 2»)."
  echo
  exit 1
fi

VERSION=$(node -p "process.versions.node.split('.')[0]")
if [ "$VERSION" -lt 18 ]; then
  echo
  echo "Tu Node.js es muy antiguo (versión $VERSION). Hace falta la 18 o superior."
  echo "Mira la guía: COMO-ABRIR-EN-LINUX.md (apartado «Si tu Node.js es antiguo»)."
  echo
  exit 1
fi

URL="http://localhost:5180"

# Abre el navegador un segundo después de arrancar la app
(
  sleep 1.5
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1
  elif command -v open >/dev/null 2>&1; then open "$URL" >/dev/null 2>&1
  else echo "Abre tú el navegador y escribe: $URL"; fi
) &

echo "Glamping abierto en $URL"
echo "NO cierres esta ventana mientras uses la app. Para terminar: pulsa Ctrl+C."
echo
node app/servidor.mjs
