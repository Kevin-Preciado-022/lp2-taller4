# Taller 4 — Aplicación Web en 4 contenedores

## Objetivo

Extender lo aprendido en el Taller 3 (separación en contenedores `web` + `api` + `database`) agregando un **cuarto contenedor**: un **reverse proxy con Nginx** que se convierte en el único punto de entrada al sistema. Además, el frontend deja de ser una plantilla Flask con Jinja2: esta vez lo vas a diseñar visualmente en **v0.app**, descargarlo y contenerizarlo tú mismo.

| Contenedor | Tecnología | Responsabilidad |
| --- | --- | --- |
| `reverse-proxy` | Nginx | Único punto de acceso público. Enruta el tráfico hacia `frontend` y `api`, y oculta la topología interna del sistema. |
| `frontend` | App generada en v0.app | Interfaz de usuario. Consume la `api` por HTTP/JSON. |
| `api` | FastAPI + SQLAlchemy | Lógica de negocio y acceso a datos. Expone un API REST. |
| `database` | PostgreSQL 15 | Persistencia de los datos. |

Al terminar sabrás:

- Diseñar una interfaz con una herramienta de generación asistida (v0.app), descargar el código resultante e integrarlo a un sistema ya existente.
- Escribir un `Dockerfile` para servir una aplicación frontend ya compilada (o un frontend estático) con Nginx.
- Configurar Nginx como **reverse proxy**: enrutamiento por ruta (`location`), cabeceras (`proxy_pass`, `proxy_set_header`), y por qué esto mejora la seguridad del sistema.
- Levantar un despliegue de **4 contenedores** con Docker Compose, construido de forma incremental y verificando cada pieza antes de añadir la siguiente.
- Elegir y justificar el modelo de datos de un sistema propio, distinto al de la tienda de los talleres anteriores.

---

## Elige tu propio tema

A diferencia de los talleres 2 y 3, **no vas a continuar con la tienda**. Escoge un dominio distinto para tu sistema (algunos ejemplos, no obligatorios): reservas de canchas deportivas, gestión de una biblioteca, seguimiento de hábitos, catálogo de recetas, control de mascotas en una veterinaria, inventario de un taller mecánico, gestión de citas médicas.

El tema debe permitirte tener, como mínimo:

- Dos entidades relacionadas en la base de datos (equivalente a `Categoria`/`Producto` del Taller 3), con una relación uno a muchos.
- Al menos 3 endpoints en la API (listar, obtener uno por identificador, filtrar por la entidad relacionada).
- Una vista de listado y una vista de detalle en el frontend.

Antes de empezar, define en un párrafo corto:

1. El nombre del sistema y su propósito.
2. Las dos entidades principales y sus campos.
3. Los endpoints que expondrá la API.

Esto reemplaza al "catálogo de productos" como hilo conductor del taller.

---

## ¿Por qué agregar un reverse proxy?

En el Taller 3, el navegador hablaba directamente con `web` (puerto 5000) y, si querías, también podías golpear `api` (puerto 8000) directamente. Eso funciona en desarrollo, pero expone dos problemas en un despliegue real:

- **Superficie de ataque:** cada puerto publicado es una puerta de entrada adicional. Si `api` y `frontend` publican sus puertos, un atacante tiene dos objetivos en vez de uno.
- **Falta de un punto único de control:** no hay un lugar central donde aplicar HTTPS, límites de tasa (`rate limiting`), compresión, cabeceras de seguridad o logs unificados.

Un reverse proxy resuelve esto: es el **único** contenedor con un puerto publicado hacia el exterior. Internamente decide, según la ruta de la petición, si la reenvía al `frontend` o a la `api`. Desde afuera, el sistema entero se ve como si fuera un solo servidor.

---

## Requisitos previos

- Haber completado el Taller 3 (o entender su código): FastAPI, SQLAlchemy, Docker Compose, variables de entorno.
- **Docker** y **Docker Compose** instalados y funcionando. Verifica con:

  ```bash
  docker --version
  docker compose version
  ```
- Una cuenta en [v0.app](https://v0.app/)
- [Node.js](https://nodejs.org/es) instalado en tu máquina **solo si** necesitas construir localmente el proyecto exportado de v0 antes de contenerizarlo (algunos exports de v0 son HTML/CSS/JS estático y no lo requieren).

---

## Conceptos clave antes de empezar

**Reverse proxy vs. proxy normal:** un proxy normal actúa en nombre del cliente (por ejemplo, para ocultar su IP al navegar). Un **reverse proxy** actúa en nombre del servidor: el cliente cree que habla con un único servidor, pero el proxy reenvía la petición hacia uno de varios servidores internos según reglas (la ruta, el dominio, etc.).

**`location` en Nginx:** cada bloque `location` de la configuración de Nginx define qué hacer con las peticiones cuya ruta coincide con un patrón. Por ejemplo, `location /api/ { proxy_pass http://api:8000/; }` reenvía todo lo que empiece por `/api/` hacia el contenedor `api`.

**`proxy_pass` y las barras finales:** la barra (`/`) al final de la URL en `proxy_pass` importa. `location /api/ { proxy_pass http://api:8000/; }` elimina el prefijo `/api/` antes de reenviar; `proxy_pass http://api:8000;` (sin barra final) lo conserva. Esta diferencia es una fuente común de errores 404.

**Exportar desde v0.app:** v0 genera un proyecto (normalmente Next.js o React). Puedes descargarlo como código fuente (botón de descarga o `npx v0 add` según la versión) o, si tu proyecto es simple, exportarlo a HTML/CSS/JS estático. Para este taller, la app resultante solo necesita hacer peticiones `fetch` hacia rutas relativas de la API (por ejemplo `/api/productos`, o el nombre que le des a tus recursos); no debe tener la URL de la API "quemada" con `localhost`.

**Build vs. runtime en el contenedor de `frontend`:** si tu export de v0 es una app Next.js/React, normalmente necesitas un `Dockerfile` de dos etapas (`multi-stage build`): una etapa que instala dependencias y compila (`npm run build`), y otra, más liviana, que solo sirve los archivos ya compilados. Esto se explica en detalle en el Paso 3.

**Red interna y nombres de servicio (recordatorio del Taller 3):** dentro de la red de Compose, cada servicio es alcanzable por su nombre (`database`, `api`, `frontend`). Ahora se agrega una capa: el navegador del usuario final solo conoce `reverse-proxy`; ni `frontend` ni `api` necesitan publicar puertos hacia el host.

---

## Lista de tareas del taller

1. Definir el tema del sistema y el modelo de datos (dos entidades relacionadas).
2. **Fase 1 — `database`:** `docker-compose.yml` con un único servicio, comandos de verificación.
3. **Fase 2 — `api`:** conexión a PostgreSQL, modelos, esquemas, CRUD, routers, ajuste del `docker-compose.yml`, verificación con `/docs`.
4. **Fase 3 — `frontend`:** diseño en v0.app, descarga, contenerización, ajuste del `docker-compose.yml`, verificación end-to-end sin proxy.
5. **Fase 4 — `reverse-proxy`:** configuración de Nginx, ajuste final del `docker-compose.yml`, verificación de todo el sistema a través de un único puerto.
6. Comandos útiles y checklist final.

---

## Estructura del proyecto (al terminar las 4 fases)

```
lp2-taller4/
├── docker-compose.yml
├── .env.example
├── .env
├── docs/
│   └── GUIA.md
│
├── database/                    # Solo configuración; usamos postgres:15 oficial
│   └── init/                    # (opcional) scripts .sql de inicialización
│
├── api/                          # Igual estructura que en el Taller 3
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── data/
│   │   └── seed.json
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── crud.py
│       ├── seed.py
│       └── routers/
│           ├── __init__.py
│           └── ...
│
├── frontend/                     # Proyecto exportado desde v0.app
│   ├── Dockerfile                # multi-stage build (o nginx simple si es estático)
│   ├── package.json
│   ├── next.config.js            # (si aplica)
│   └── ...                       # resto del código generado por v0
│
└── reverse-proxy/
    ├── Dockerfile
    └── nginx.conf
```

> Fíjate en el patrón que se repite desde el Taller 3: cada servicio con código propio tiene su carpeta y su `Dockerfile`; `database` sigue sin tenerlo porque usamos la imagen oficial de Docker Hub.

---

## Fase 1 — Contenedor de la base de datos

### Paso 1.1 — Variables de entorno

Crea `.env.example` en la raíz:

```dotenv
POSTGRES_USER=taller4_user
POSTGRES_PASSWORD=cambia_esta_clave
POSTGRES_DB=taller4_db
```

Cópialo a `.env` y ajusta los valores (no lo subas al repositorio).

### Paso 1.2 — `docker-compose.yml` (solo `database`)

Levanta **únicamente** el servicio de base de datos, con:

- Imagen `postgres:15`.
- Variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` tomadas del `.env`.
- Un volumen nombrado para persistir los datos (`pgdata:/var/lib/postgresql/data`).
- Un `healthcheck` con `pg_isready`.
- Publica el puerto `5432` hacia el host **solo temporalmente**, para poder probar desde tu máquina en este paso (lo retirarás cuando agregues el reverse proxy, ya que la base de datos nunca debe ser accesible desde fuera de la red de Compose en un sistema con proxy).

### Paso 1.3 — Levantar y probar

```bash
docker compose up -d database
docker compose ps
```

Verifica que el estado sea `healthy`. Luego conéctate con `psql` desde dentro del propio contenedor:

```bash
docker compose exec database psql -U taller4_user -d taller4_db -c "\dt"
```

Debe ejecutar sin error (aunque no haya tablas todavía: eso confirma que el servidor acepta conexiones y las credenciales son correctas).

**Checkpoint de la Fase 1:** el contenedor está `healthy`, aceptas conexiones con `psql`, y los datos sobreviven a un `docker compose restart database` (pruébalo).

---

## Fase 2 — Contenedor de la API

### Paso 2.1 — Modelo de datos

Diseña `models.py` con tus dos entidades relacionadas (equivalente a `Categoria`/`Producto`), usando `relationship(..., back_populates=...)` en ambos lados, igual que en el Taller 3.

### Paso 2.2 — `database.py`, `schemas.py`, `crud.py`

Misma separación de responsabilidades del Taller 3:

- `database.py`: `engine`, `SessionLocal`, `Base`, `get_db()`, leyendo `DATABASE_URL` desde el entorno.
- `schemas.py`: esquemas Pydantic que describen el JSON de la API (no confundir con los modelos SQLAlchemy).
- `crud.py`: funciones que reciben la sesión `db` como parámetro explícito y hacen las consultas.

### Paso 2.3 — `routers/` y `main.py`

Define al menos:

- `GET /<entidad-principal>/` con filtro opcional por la entidad relacionada (equivalente a `?categoria_id=`).
- `GET /<entidad-principal>/{id}`.
- `GET /<entidad-relacionada>/`.

En `main.py`, crea las tablas al arrancar (`Base.metadata.create_all(bind=engine)`) y registra los routers.

### Paso 2.4 — Dockerfile de la API

Igual que en el Taller 3: imagen base `python:3.x-slim`, copia de `requirements.txt` e instalación de dependencias, copia del código, arranque con `uvicorn`.

### Paso 2.5 — Ajustar `docker-compose.yml`

Agrega el servicio `api`:

- `build: ./api`.
- `DATABASE_URL=postgresql://usuario:password@database:5432/basededatos`.
- `depends_on: database` con `condition: service_healthy`.
- Publica el puerto `8000` hacia el host, **solo temporalmente**, para poder probar `/docs` antes de tener el reverse proxy (lo retirarás en la Fase 4).

### Paso 2.6 — Levantar, cargar datos y probar

```bash
docker compose up -d --build
docker compose exec api python -m app.seed
```

Abre `http://localhost:8000/docs` y verifica que cada endpoint devuelva datos reales, incluyendo el filtro por la entidad relacionada.

**Checkpoint de la Fase 2:** `database` y `api` corriendo, `/docs` responde con datos reales, y puedes explicar por qué `api` se conecta a `database` usando ese nombre de host y no `localhost`.

---

## Fase 3 — Contenedor del frontend (v0.app)

### Paso 3.1 — Diseñar la interfaz en v0.app

En [v0.app](https://v0.app/), describe la interfaz de tu sistema: una vista de listado (equivalente al catálogo) y una vista de detalle. Pide explícitamente que las peticiones de datos se hagan a rutas **relativas** (por ejemplo `/api/<entidad>`), no a una URL absoluta con `localhost` ni con un dominio inventado — esto es clave para que funcione detrás del reverse proxy en la Fase 4.

### Paso 3.2 — Descargar el proyecto

Descarga el código generado (según la versión de v0, esto es un botón de "Download" o el comando que te indique la plataforma) y colócalo en la carpeta `frontend/` de tu proyecto.

### Paso 3.3 — Ajustar las llamadas a la API

Revisa el código descargado y localiza dónde hace `fetch`/`axios` hacia los datos. Ajusta las URLs para que apunten a rutas relativas que empiecen por `/api/...` (ej. `/api/productos`), ya que el reverse proxy de la Fase 4 se encargará de traducir eso hacia el contenedor `api`. Por ahora, mientras pruebas sin el proxy, puedes usar una variable de entorno de build (ej. `NEXT_PUBLIC_API_URL`) para apuntar directamente a `http://localhost:8000` y confirmar que el diseño funciona con datos reales.

### Paso 3.4 — Dockerfile del frontend

Si tu export es una app Next.js/React (lo más probable con v0), usa un `Dockerfile` de dos etapas:

1. **Etapa build:** imagen `node:*-alpine`, copia del proyecto, `npm install`, `npm run build`.
2. **Etapa runtime:** una imagen liviana (puede ser otra vez `node` en modo `next start`, o Nginx sirviendo el export estático si usaste `next export`/un framework que genere HTML estático) que solo copia el resultado del build de la etapa anterior.

Si tu export es HTML/CSS/JS estático (sin build), el `Dockerfile` puede ser simplemente una imagen `nginx:alpine` que copie los archivos estáticos a `/usr/share/nginx/html`.

### Paso 3.5 — Ajustar `docker-compose.yml`

Agrega el servicio `frontend`:

- `build: ./frontend`.
- Publica su puerto (ej. `3000`) hacia el host, **solo temporalmente**, para verificar el diseño antes de esconderlo detrás del proxy.
- `depends_on: api`.

### Paso 3.6 — Probar de extremo a extremo (sin proxy todavía)

```bash
docker compose up -d --build
```

Abre `http://localhost:3000` (o el puerto que hayas usado) y verifica:

1. El listado carga datos reales desde la `api`.
2. La vista de detalle muestra los datos completos de un registro, incluyendo la entidad relacionada.
3. Un identificador inexistente se maneja sin que la página se rompa.

**Checkpoint de la Fase 3:** los 3 contenedores (`database`, `api`, `frontend`) funcionan juntos, cada uno con su puerto publicado temporalmente. A partir de aquí, el objetivo de la Fase 4 es que **solo uno** de esos puertos siga siendo público.

---

## Fase 4 — Contenedor del reverse proxy (Nginx)

### Paso 4.1 — `reverse-proxy/nginx.conf`

Escribe una configuración con, al menos, dos bloques `location` dentro de un `server`:

- `location /api/ { proxy_pass http://api:8000/; }` — todo lo que empiece por `/api/` va hacia el contenedor `api`, sin ese prefijo.
- `location / { proxy_pass http://frontend:3000; }` — todo lo demás va hacia el `frontend`.

Agrega las cabeceras recomendadas para que la app detrás del proxy sepa de dónde viene realmente la petición:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### Paso 4.2 — `reverse-proxy/Dockerfile`

Una imagen `nginx:alpine` que copie tu `nginx.conf` a `/etc/nginx/conf.d/default.conf` (reemplazando el archivo por defecto).

### Paso 4.3 — Ajustar tu API para el prefijo `/api`

Como el proxy quita el prefijo `/api/` antes de reenviar, tu API sigue respondiendo en sus rutas normales (`/productos/`, etc.), sin cambios adicionales de código. Verifica que ningún lugar del frontend tenga la URL de la API "quemada" con `localhost:8000`; debe usar rutas relativas (`/api/...`) para que funcionen igual dentro y fuera de Docker.

### Paso 4.4 — Ajuste final de `docker-compose.yml`

- Agrega el servicio `reverse-proxy`, con `build: ./reverse-proxy`, publicando **el único puerto externo del sistema** (ej. `"80:80"`), y `depends_on` hacia `frontend` y `api`.
- **Retira** los `ports` que habías publicado temporalmente en `database`, `api` y `frontend` en las fases anteriores. Ningún contenedor salvo `reverse-proxy` debe exponer un puerto al host.
- Verifica que las variables de entorno del `frontend` (si usaste una URL absoluta para pruebas) vuelvan a apuntar a la ruta relativa `/api`.

### Paso 4.5 — Levantar todo el sistema

```bash
docker compose down
docker compose up -d --build
docker compose ps
```

Deberías ver los 4 servicios corriendo, y **solo** `reverse-proxy` con un puerto mapeado hacia el host.

### Paso 4.6 — Probar el sistema completo

Abre `http://localhost` (puerto 80, sin especificar puerto en la URL) y verifica:

1. El frontend carga con normalidad.
2. El listado y el detalle muestran datos reales, obtenidos a través del proxy (`/api/...`).
3. Con las herramientas de desarrollador del navegador (pestaña Network), confirma que las peticiones a la API salen hacia `/api/...` en el mismo origen (`localhost`), no hacia `localhost:8000`.
4. Intenta acceder directamente a `http://localhost:8000` o `http://localhost:5432` desde tu navegador: no deberían responder, porque esos puertos ya no están publicados.

**Checkpoint de la Fase 4:** el sistema completo es accesible por un único puerto, y puedes explicar qué pasaría si quisieras poner el mismo `frontend` detrás de dos dominios distintos, o si quisieras agregar HTTPS sin tocar `api` ni `frontend`.

---

## Comandos útiles de Docker Compose

| Comando | Qué hace |
| --- | --- |
| `docker compose up -d --build` | Construye y levanta todo en segundo plano |
| `docker compose ps` | Lista el estado de los servicios |
| `docker compose logs -f reverse-proxy` | Sigue en vivo los logs del proxy |
| `docker compose exec api bash` | Abre una terminal dentro del contenedor `api` |
| `docker compose restart reverse-proxy` | Reinicia solo el proxy (útil tras editar `nginx.conf`) |
| `docker compose down` | Detiene y elimina los contenedores (los volúmenes se conservan) |
| `docker compose down -v` | Igual que arriba, pero también borra los volúmenes |

---

## Errores frecuentes

| Síntoma | Causa probable |
| --- | --- |
| `502 Bad Gateway` en Nginx | El servicio al que apunta `proxy_pass` no está corriendo, o el nombre del servicio en `nginx.conf` no coincide con el nombre en `docker-compose.yml`. |
| `404` en todas las llamadas a `/api/...` | Falta o sobra la barra final en `proxy_pass` (`http://api:8000/` vs `http://api:8000`), lo que cambia si se conserva o se elimina el prefijo `/api/`. |
| El frontend funciona en `localhost:3000` pero no detrás del proxy en `localhost` | El frontend tiene la URL de la API "quemada" (`http://localhost:8000`) en vez de una ruta relativa `/api/...`. |
| `nginx: [emerg] host not found in upstream "api"` | El contenedor `reverse-proxy` arrancó antes que `api`, o el `depends_on` no está bien configurado; revisa también que el nombre del servicio sea exactamente `api`. |
| El build del `frontend` falla por memoria o tarda demasiado | Verifica que el `Dockerfile` use el `multi-stage build` correctamente y no esté copiando `node_modules` innecesarios (usa un `.dockerignore`). |
| Puedes acceder a la base de datos o a la API directamente desde el navegador | Olvidaste retirar los `ports` temporales de `database`/`api`/`frontend` en el Paso 4.4. |

---

## Checklist final

- [ ] Tema del sistema definido, con dos entidades relacionadas.
- [ ] `database`: contenedor `healthy`, datos persistentes entre reinicios.
- [ ] `api`: modelos, esquemas, CRUD y routers completos; `/docs` responde con datos reales.
- [ ] `frontend`: diseñado en v0.app, descargado, contenerizado, sin URLs de API "quemadas" (usa rutas relativas `/api/...`).
- [ ] `reverse-proxy`: enruta correctamente `/api/*` hacia `api` y el resto hacia `frontend`.
- [ ] `docker compose ps` muestra los 4 servicios corriendo, y **solo** `reverse-proxy` publica un puerto hacia el host.
- [ ] Puedes explicar, en tus propias palabras, qué problema de seguridad resuelve un reverse proxy y por qué `database` y `api` no deberían tener puertos publicados en un despliegue real.

