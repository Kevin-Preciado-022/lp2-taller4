import json
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import models

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)


def cargar_datos():
    db: Session = SessionLocal()
    try:
        with open("api/data/seed.json", "r", encoding="utf-8") as f:
            datos = json.load(f)

        # Insertar categorías y productos
        for item in datos.get("categorias", []):
            categoria = db.query(models.Categoria).filter_by(nombre=item["nombre"]).first()
            if not categoria:
                categoria = models.Categoria(nombre=item["nombre"])
                db.add(categoria)
                db.commit()
                db.refresh(categoria)

            for prod in item.get("productos", []):
                producto = db.query(models.Producto).filter_by(nombre=prod["nombre"]).first()
                if not producto:
                    nuevo = models.Producto(
                        nombre=prod["nombre"],
                        precio=prod["precio"],
                        stock=prod["stock"],
                        activo=prod.get("activo", True),
                        categoria_id=categoria.id,
                    )
                    db.add(nuevo)
                    db.commit()
                    db.refresh(nuevo)
    finally:
        db.close()


if __name__ == "__main__":
    cargar_datos()
