"""FastAPI server for ML sidecar communication."""

from fastapi import FastAPI

app = FastAPI(
    title="Kuro-ML",
    description="ML sidecar for Kuro-Roku file organization",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Kuro-ML sidecar running"}


# TODO: Add endpoints for VLM, transcription, embeddings

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8321)
