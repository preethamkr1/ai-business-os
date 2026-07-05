from fastapi import APIRouter, HTTPException

from app.models.user import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    hash_password,
    verify_password,
    generate_tenant_id,
    create_access_token
)

from app.services.mongo_service import db

router = APIRouter()

users_collection = db["users"]


@router.post("/register")
def register(
    request: RegisterRequest
):

    existing_user = users_collection.find_one(
        {
            "email": request.email
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    tenant_id = generate_tenant_id(
        request.company_name
    )

    user_data = {
        "name": request.name,
        "email": request.email,
        "password": hash_password(
            request.password
        ),
        "company_name": request.company_name,
        "industry": request.industry,
        "tenant_id": tenant_id
    }

    users_collection.insert_one(
        user_data
    )

    token = create_access_token(
        {
            "email": request.email,
            "tenant_id": tenant_id,
            "company_name": request.company_name
        }
    )

    return {
        "message": "Registration Successful",
        "token": token,
        "tenant_id": tenant_id,
        "company_name": request.company_name
    }


@router.post("/login")
def login(
    request: LoginRequest
):

    user = users_collection.find_one(
        {
            "email": request.email
        }
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    if not verify_password(
        request.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    token = create_access_token(
        {
            "email": user["email"],
            "tenant_id": user["tenant_id"],
            "company_name": user["company_name"]
        }
    )

    return {
        "message": "Login Successful",
        "token": token,
        "tenant_id": user["tenant_id"],
        "company_name": user["company_name"]
    }