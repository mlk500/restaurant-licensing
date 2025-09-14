import PyPDF2
import json
import re


def extract_regulations_from_pdf(pdf_path):
    """Extract regulations from the actual PDF file"""

    regulations = []

    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            print(f"Total pages: {len(reader.pages)}")

            # Focus on Health Ministry section (pages 10-48)
            health_text = ""
            for page_num in range(
                9, min(48, len(reader.pages))
            ):  # Pages 10-48 (0-indexed)
                page = reader.pages[page_num]
                text = page.extract_text()
                health_text += text + "\n"

            # Look for regulation patterns in Hebrew
            patterns = [
                r"נדרש[:\s]+([^\.•\n]+)",
                r"חובה[:\s]+([^\.•\n]+)",
                r"יש להתקין[:\s]+([^\.•\n]+)",
                r"יש לוודא[:\s]+([^\.•\n]+)",
                r"חייב[:\s]+([^\.•\n]+)",
            ]

            regulation_id = 1
            for pattern in patterns:
                matches = re.findall(pattern, health_text)
                for match in matches:
                    if len(match.strip()) > 10:  # Filter out very short matches
                        regulations.append(
                            {
                                "id": regulation_id,
                                "category": "health",
                                "hebrew_text": match.strip(),
                                "source_page": "10-48",
                                "priority": "high",
                            }
                        )
                        regulation_id += 1

            # Extract Fire Department section (pages 50+)
            if len(reader.pages) > 49:
                fire_text = ""
                for page_num in range(49, min(55, len(reader.pages))):
                    page = reader.pages[page_num]
                    text = page.extract_text()
                    fire_text += text + "\n"

                # Look for fire safety patterns
                fire_matches = re.findall(r"[•·־-]\s*([^•·־\n]{20,200})", fire_text)
                for match in fire_matches[:10]:  # Limit to 10 fire regulations
                    if any(word in match for word in ["כיבוי", "אש", "חירום", "מטף"]):
                        regulations.append(
                            {
                                "id": regulation_id,
                                "category": "fire_safety",
                                "hebrew_text": match.strip(),
                                "source_page": "50+",
                                "priority": "critical",
                            }
                        )
                        regulation_id += 1

            print(f"Extracted {len(regulations)} regulations")
            return regulations

    except Exception as e:
        print(f"Error reading PDF: {e}")
        return []


def save_extracted_data(pdf_path, output_path="../data/extracted_regulations.json"):
    """Extract and save regulations to JSON"""

    regulations = extract_regulations_from_pdf(pdf_path)

    # If extraction didn't work well, add some manual examples
    if len(regulations) < 10:
        print("Adding manual examples from the PDF content you know exists...")
        regulations.extend(
            [
                {
                    "id": len(regulations) + 1,
                    "category": "health",
                    "hebrew_text": "נדרש אישור משרד הבריאות לפני פתיחת העסק",
                    "source_page": "manual",
                    "priority": "critical",
                },
                {
                    "id": len(regulations) + 2,
                    "category": "kitchen",
                    "hebrew_text": "חובה להתקין כיור נפרד לרחצת ידיים",
                    "source_page": "manual",
                    "priority": "high",
                },
            ]
        )

    output = {
        "source_file": pdf_path,
        "extraction_date": "2024-09-13",
        "total_pages_processed": "10-50",
        "regulations": regulations[:20],  # Limit to 20 for the demo
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(output['regulations'])} regulations to {output_path}")
    return output


if __name__ == "__main__":
    # Run this directly to extract data
    pdf_file = "../data/restaurant_regulations.pdf"
    save_extracted_data(pdf_file)
