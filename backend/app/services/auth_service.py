import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "business_growth_os_secret_key"
ALGORITHM = "HS256"


def hash_password(password: str):
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def generate_tenant_id(company_name: str):
    words = company_name.split()

    prefix = "".join(
        [w[0] for w in words]
    ).lower()

    return prefix + str(
        int(datetime.now().timestamp())
    )[-4:]


def create_access_token(data: dict):

    payload = data.copy()

    payload["exp"] = (
        datetime.utcnow() +
        timedelta(days=7)
    )

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token