from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False, unique=True)

    # Relación uno-a-muchos con Producto
    productos = relationship("Producto", back_populates="categoria")

    def __repr__(self):
        return f"<Categoria {self.nombre}>"


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(160), nullable=False)
    precio = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)

    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)

    # Relación muchos-a-uno con Categoria
    categoria = relationship("Categoria", back_populates="productos")

    def __repr__(self):
        return f"<Producto {self.nombre} - {self.precio}>"

    @property
    def disponible(self):
        """True si el producto está activo y tiene unidades en stock."""
        return self.activo and self.stock > 0
