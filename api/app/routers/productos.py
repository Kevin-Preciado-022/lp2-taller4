from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from .. import database, models, schemas

router = APIRouter(prefix="/productos", tags=["productos"])


@router.get("/", response_model=list[schemas.Producto])
def listar_productos(categoria_id: Optional[int] = None, db: Session = Depends(database.get_db)):
    if categoria_id:
        return db.query(models.Producto).filter(models.Producto.categoria_id == categoria_id).all()
    return db.query(models.Producto).all()


@router.get("/{id}", response_model=schemas.Producto)
def obtener_producto(id: int, db: Session = Depends(database.get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto
