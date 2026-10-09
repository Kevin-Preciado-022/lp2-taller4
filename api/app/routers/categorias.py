from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, models, schemas

router = APIRouter(prefix="/categorias", tags=["categorias"])


@router.get("/", response_model=list[schemas.Categoria])
def listar_categorias(db: Session = Depends(database.get_db)):
    return db.query(models.Categoria).all()
