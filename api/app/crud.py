from sqlalchemy.orm import Session
from . import models, schemas


# --- Categoria ---
def get_categorias(db: Session):
    return db.query(models.Categoria).all()


def create_categoria(db: Session, categoria: schemas.CategoriaCreate):
    nueva = models.Categoria(nombre=categoria.nombre)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


# --- Producto ---
def get_productos(db: Session):
    return db.query(models.Producto).all()


def create_producto(db: Session, producto: schemas.ProductoCreate):
    nuevo = models.Producto(
        nombre=producto.nombre,
        precio=producto.precio,
        stock=producto.stock,
        activo=producto.activo,
        categoria_id=producto.categoria_id,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo
