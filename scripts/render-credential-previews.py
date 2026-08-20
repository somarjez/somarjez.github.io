from pathlib import Path
import shutil

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "portfolio-credentials" / "certifcates"
DEST = ROOT / "public" / "credentials"

PDFS = {
    "4-hour Webinar on Data Privacy Awareness RAMOS_JEZREEL.pdf": "data-privacy-awareness",
    "ApplyAIUpdateYourResumev120260813-20-tp9b24.pdf": "apply-ai-update-your-resume",
    "Are your S3CretS Safe Forti&ing Your Certificate Jezreel R. Ramos.pdf": "aws-bucket-breaches",
    "CodeChum Certificate RamosJezreel-19903.pdf": "java-software-engineering-i",
    "DataAnalyticsEssentialsUpdate20260813-20-5fpb7t.pdf": "data-analytics-essentials",
    "DataScienceEssentialswithPythonv120260813-20-71nzrr.pdf": "data-science-essentials-with-python",
    "Integrated OS Be More DigiTalino Certificate_of_Participation_-361.pdf": "integrated-os-digi-talino",
    "IntrotoModernAIUpdate20260813-20-qjixfv.pdf": "introduction-to-modern-ai",
    "IntrotoDataScienceUpdate20260820-22-13dtw7.pdf": "introduction-to-data-science",
    "“AI-Powered Future  Mastering Prompt_JEZREEL_R_RAMOS.pdf": "ai-powered-future-prompt-engineering",
    "“Hour of Code”  (Bulk 1) Copy of OG BTFM x AI Ready ASEAN Programme_Certificate.pdf": "hour-of-code-ai-ready-asean",
}

for folder in (DEST / "certificates", DEST / "previews"):
    folder.mkdir(parents=True, exist_ok=True)

for filename, slug in PDFS.items():
    source = SOURCE / filename
    shutil.copyfile(source, DEST / "certificates" / f"{slug}.pdf")
    document = pdfium.PdfDocument(source)
    page = document[0]
    image = page.render(scale=1.6).to_pil().convert("RGB")
    image.thumbnail((1400, 1000))
    image.save(DEST / "previews" / f"{slug}.webp", "WEBP", quality=84, method=6)

seminar = SOURCE / "SEMINAR_AI-Driven_Software_Development.jpg"
shutil.copyfile(seminar, DEST / "certificates" / "ai-driven-software-development.jpg")
shutil.copyfile(seminar, DEST / "previews" / "ai-driven-software-development.jpg")
