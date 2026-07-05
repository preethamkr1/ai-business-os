from fastapi import APIRouter, UploadFile, File, Form
import pandas as pd
from app.services.orchestrator import run_business_os
from app.services.mongo_service import raw_data_collection
import datetime

router = APIRouter()


@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    tenant_id: str = Form(...)
):

    df = pd.read_csv(file.file)
    df = df.fillna("")

    rows = len(df)
    columns = list(df.columns)

    preview = df.head(5).to_dict(
        orient="records"
    )

    full_records = df.to_dict(orient="records")
    raw_data_collection.insert_one({
        "tenant_id": tenant_id,
        "filename": file.filename,
        "upload_timestamp": datetime.datetime.utcnow().isoformat(),
        "rows": rows,
        "data": full_records
    })

    run_business_os({
        "tenant_id": tenant_id,
        "csv_data": {
            "columns": columns,
            "preview": preview
        }
    })

    return {
        "filename": file.filename,
        "rows": rows,
        "columns": columns,
        "preview": preview
    }