from fastapi import FastAPI
from .database import Base, engine
from .routers import productos, categorias

# Crear tablas al arrancar
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrar routers
app.include_router(productos.router)
app.include_router(categorias.router)
