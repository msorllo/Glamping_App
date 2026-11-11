# Cómo abrir la app del Glamping en Linux

Sirve para Ubuntu, Linux Mint, Debian, Fedora, Arch y derivados. Son 4 pasos y solo se hacen una vez.

---

## Paso 1 · Descargar el proyecto

1. Entra en **https://github.com/msorllo/Glamping_App**
2. Pulsa el botón verde **«Code»** y luego **«Download ZIP»**.
3. Se guarda como `Glamping_App-main.zip` (normalmente en *Descargas*).

## Paso 2 · Instalar Node.js (solo la primera vez)

Es un programa gratuito que necesita la app. Abre una **Terminal** (en la mayoría de sistemas: `Ctrl + Alt + T`) y copia el comando de tu sistema:

| Tu sistema | Comando |
|---|---|
| Ubuntu, Linux Mint, Debian | `sudo apt update && sudo apt install -y nodejs unzip` |
| Fedora | `sudo dnf install -y nodejs unzip` |
| Arch, Manjaro | `sudo pacman -S nodejs unzip` |
| openSUSE | `sudo zypper install nodejs unzip` |

Te pedirá tu contraseña (al escribirla no se ve nada; es normal). Pulsa Intro.

Comprueba que ha quedado bien:

```bash
node -v
```

Debe salir un número **18 o superior** (por ejemplo `v20.11.0`). Si sale menor, mira el apartado «Si tu Node.js es antiguo» más abajo.

## Paso 3 · Descomprimir

Con el administrador de archivos: clic derecho sobre el ZIP y **«Extraer aquí»**.

O desde la Terminal:

```bash
cd ~/Descargas
unzip Glamping_App-main.zip
```

(Si tu carpeta se llama *Downloads* en vez de *Descargas*, escribe `cd ~/Downloads`.)

## Paso 4 · Abrir la app

En la Terminal:

```bash
cd ~/Descargas/Glamping_App-main
bash abrir-glamping.sh
```

Se abrirá el navegador con la app. Si no se abre solo, escribe en su barra de direcciones: **http://localhost:5180**

> **No cierres la Terminal mientras uses la app.** Para terminar, pulsa `Ctrl + C` o ciérrala.

---

## Abrirla las próximas veces

Solo el Paso 4. Si quieres que se abra con doble clic: clic derecho sobre `abrir-glamping.sh` → *Propiedades* → *Permisos* → marca **«Permitir ejecutar como un programa»**. Después, doble clic y elige **«Ejecutar en el terminal»**.

## Si tu Node.js es antiguo

Pasa en distribuciones con versiones viejas (por ejemplo Ubuntu 20.04 o Debian 11). Lo más sencillo es **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Cierra y vuelve a abrir la Terminal y escribe:

```bash
nvm install --lts
```

Después repite el Paso 4.

## Si algo no funciona

| Qué ves | Qué hacer |
|---|---|
| `node: command not found` | Repite el Paso 2. |
| `bash: abrir-glamping.sh: No existe el archivo` | Estás en la carpeta equivocada. Usa `ls` para ver dónde estás y `cd` hasta la carpeta `Glamping_App-main`. |
| `EADDRINUSE` o «puerto en uso» | La app ya está abierta en otra Terminal. Ciérrala o usa otro puerto: `PUERTO=5190 node app/servidor.mjs` y abre http://localhost:5190 |
| El navegador no se abre | Escribe `http://localhost:5180` en su barra de direcciones. |
| Página en blanco | Pulsa `F5` para recargar. |

## Para compartir tus cambios

En la app, abajo a la izquierda: **«Exportar»** descarga un archivo con todo lo que has editado; la otra persona pulsa **«Importar»** y lo elige. Funciona igual entre Windows, Mac y Linux.

## Si usas Git (opcional)

```bash
git clone https://github.com/msorllo/Glamping_App.git
cd Glamping_App
bash abrir-glamping.sh
```
