from pydantic import BaseModel
from typing import List, Optional


class ProductoBase(BaseModel):
    nombre: str
    precio: float
    stock: int
    activo: bool = True


class ProductoCreate(ProductoBase):
    categoria_id: int


class Producto(ProductoBase):
    id: int
    categoria_id: int

    class Config:
        orm_mode = True


class CategoriaBase(BaseModel):
    nombre: str


class CategoriaCreate(CategoriaBase):
    pass


class Categoria(CategoriaBase):
    id: int
    productos: List[Producto] = []

    class Config:
        orm_mode = True
