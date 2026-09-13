import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User, Department, AuditLog
from backend.schemas import LoginRequest, TokenResponse, UserResponse
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization:
        # Default to higher hod for ease of browsing if no header sent
        user = db.query(User).filter(User.emp_id == "hod001").first()
        if user:
            return user
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "").strip()
    # Simple token scheme: token can be emp_id or demo token
    emp_id = token
    user = db.query(User).filter(User.emp_id == emp_id).first()
    if not user:
        # try standard fallback
        user = db.query(User).filter(User.emp_id == "hod001").first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.emp_id == req.emp_id.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Employee ID")
    
    if user.password_hash != hash_pw(req.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    # Audit log login
    db.add(AuditLog(
        user_id=user.id,
        user_name=user.name,
        role=user.role,
        action="USER_LOGIN",
        entity_type="AUTH",
        entity_id=user.emp_id,
        details=f"User {user.name} logged in successfully."
    ))
    db.commit()

    dept_code = user.department.code if user.department else None
    dept_name = user.department.name if user.department else None

    user_resp = UserResponse(
        id=user.id,
        emp_id=user.emp_id,
        name=user.name,
        email=user.email,
        role=user.role,
        department_id=user.department_id,
        department_code=dept_code,
        department_name=dept_name,
        is_active=user.is_active
    )

    return TokenResponse(
        access_token=user.emp_id,
        token_type="bearer",
        user=user_resp
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    dept_code = current_user.department.code if current_user.department else None
    dept_name = current_user.department.name if current_user.department else None
    return UserResponse(
        id=current_user.id,
        emp_id=current_user.emp_id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        department_id=current_user.department_id,
        department_code=dept_code,
        department_name=dept_name,
        is_active=current_user.is_active
    )

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    res = []
    for u in users:
        res.append({
            "emp_id": u.emp_id,
            "name": u.name,
            "role": u.role,
            "department_code": u.department.code if u.department else "ALL",
            "department_name": u.department.name if u.department else "All Departments"
        })
    return res
