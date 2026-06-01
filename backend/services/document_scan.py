import json
import os
from pathlib import Path

from PIL import Image
import pytesseract
from PyPDF2 import PdfReader


def extract_text_from_image(filepath):
    try:
        with Image.open(filepath) as image:
            text = pytesseract.image_to_string(image, lang="fra")
            return text.strip()
    except Exception as exc:
        return f"OCR failed: {exc}"


def extract_text_from_pdf(filepath):
    try:
        reader = PdfReader(filepath)
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        result = "\n".join(pages).strip()
        if result:
            return result
        return "PDF text extraction succeeded but no text was found."
    except Exception as exc:
        return f"PDF extraction failed: {exc}"


def scan_document(filepath):
    ext = Path(filepath).suffix.lower()
    if ext in {".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".gif"}:
        return extract_text_from_image(filepath)
    if ext == ".pdf":
        return extract_text_from_pdf(filepath)
    return f"Type de fichier non supporté pour scan: {ext}"


def scan_documents(file_map):
    report = {}
    for document_type, filename in file_map.items():
        path = os.path.join("uploads", filename)
        report[document_type] = scan_document(path)
    return report


def scan_documents_json(file_map):
    return json.dumps(scan_documents(file_map), ensure_ascii=False)
