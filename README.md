# Lenguaje de Programación 2 - Taller 4

![commits](https://badgen.net/github/commits/clubdecomputacion/lp2-taller4?icon=github) 
![last_commit](https://img.shields.io/github/last-commit/clubdecomputacion/lp2-taller4)

- ver [badgen](https://badgen.net/) o [shields](https://shields.io/) para otros tipos de _badges_

## Autor

- [@Kevin Dario Preciado Vallecilla](https://github.com/Kevin-Preciado-022/lp2-taller4.git)

## Descripción del Proyecto

# Tienda Virtual con FastAPI, PostgreSQL y Docker

Este proyecto implementa una tienda virtual con backend en **FastAPI**, base de datos en **PostgreSQL** y despliegue mediante **Docker Compose**. Incluye carga automática de datos iniciales (categorías y productos) desde un archivo `seed.json`.

---

## 🚀 Tecnologías utilizadas
- **Python 3.11**
- **FastAPI** (API REST)
- **SQLAlchemy** (ORM)
- **PostgreSQL 15**
- **Docker & Docker Compose**
- **Nginx** (reverse proxy)
- **Next.js** (frontend)

---

## 📂 Estructura del proyecto
lp2-taller4/
├── api/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── routers/
│   │   └── seed.py
│   └── data/seed.json
├── frontend/
├── reverse-proxy/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
## Proceso

Siguiento los pasos de la guia y teniendo en cuenta la estrutura de los proyectos anteriores (los talleres anteriores), agregando dos nuevos conectenedpres reverse proxy y fronted la creacion de frontend, junto con su posterior conexion a los otros cotenedores. aqui esta la configuracion


---

## ⚙️ Configuración

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repo>
   cd lp2-taller4

POSTGRES_USER=taller4_user
POSTGRES_PASSWORD=Cielo_Rojo_1
POSTGRES_DB=taller4_db
DATABASE_URL=postgresql://taller4_user:Cielo_Rojo_1@database:5432/taller4_db



[GUIA.md](docs/GUIA.md)

