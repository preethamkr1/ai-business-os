from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    name: Optional[str] = ""
    email: EmailStr
    password: str
    company_name: str
    industry: Optional[str] = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str