import google.generativeai as genai
import os
import json
from typing import List, Dict

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-api-key-here")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


def generate_report(regulations: List[Dict], user_input: Dict) -> str:
    """Generate a structured report using Gemini AI"""

    prompt = f"""
    אתה יועץ רישוי עסקים מקצועי בישראל.
    
    פרטי העסק:
    - גודל: {user_input.get('size')} מ"ר
    - מקומות ישיבה: {user_input.get('seats')}
    - משתמש בגז: {'כן' if user_input.get('usesGas') else 'לא'}
    - מגיש בשר: {'כן' if user_input.get('servesMeat') else 'לא'}
    
    דרישות החוק הרלוונטיות:
    {json.dumps(regulations, ensure_ascii=False, indent=2)}
    
    צור דוח מובנה בפורמט JSON בלבד. החזר JSON תקין עם המבנה הבא:
    {{
      "summary": "סיכום של 2-3 משפטים על העסק והדרישות העיקריות",
      "total_estimated_cost": {{
        "min": <מספר>,
        "max": <מספר>
      }},
      "total_estimated_days": <מספר>,
      "requirements": [
        {{
          "id": <מספר>,
          "title": "כותרת קצרה וברורה לדרישה",
          "original_text": "הטקסט המקורי מהחוק",
          "importance": "קריטי | חשוב | רצוי",
          "category": "בטיחות אש | בריאות | תברואה | כללי",
          "plain_explanation": "הסבר בעברית פשוטה מה צריך לעשות",
          "practical_tips": ["טיפ 1", "טיפ 2"],
          "estimated_cost": {{
            "min": <מספר>,
            "max": <מספר>,
            "notes": "הערות לגבי העלות"
          }},
          "estimated_time_days": <מספר>,
          "required_professionals": ["יועץ בטיחות", "קבלן"]
        }}
      ],
      "next_steps": [
        "צעד ראשון מומלץ",
        "צעד שני",
        "צעד שלישי"
      ],
      "important_notes": [
        "הערה חשובה 1",
        "הערה חשובה 2"
      ]
    }}
    
    חשוב:
    - החזר רק JSON תקין, ללא טקסט נוסף
    - השתמש בעברית ברורה ופשוטה
    - תן הערכות עלות ריאליות בשקלים
    - סדר את הדרישות לפי חשיבות (קריטי קודם)
    """

    try:
        response = model.generate_content(prompt)
        # Clean response - sometimes AI adds markdown formatting
        json_text = response.text
        if "```json" in json_text:
            json_text = json_text.split("```json")[1].split("```")[0]
        elif "```" in json_text:
            json_text = json_text.split("```")[1].split("```")[0]

        # Parse to validate JSON
        parsed = json.loads(json_text)
        return json.dumps(parsed, ensure_ascii=False)

    except json.JSONDecodeError as e:
        # Fallback to text if JSON parsing fails
        return json.dumps(
            {
                "summary": "שגיאה בעיבוד הדוח. מוצגות הדרישות הגולמיות.",
                "error": str(e),
                "raw_text": response.text if "response" in locals() else "",
                "requirements": [
                    {
                        "id": i + 1,
                        "title": f"דרישה {i+1}",
                        "original_text": reg.get("hebrew_text", ""),
                        "importance": reg.get("priority", "חשוב"),
                        "category": reg.get("category", "כללי"),
                        "plain_explanation": "נדרש עיבוד נוסף",
                        "practical_tips": [],
                        "estimated_cost": {"min": 0, "max": 0},
                        "estimated_time_days": 0,
                    }
                    for i, reg in enumerate(regulations)
                ],
            },
            ensure_ascii=False,
        )
    except Exception as e:
        return json.dumps(
            {
                "summary": f"שגיאה בחיבור לשירות AI: {str(e)}",
                "requirements": [],
                "error": True,
            },
            ensure_ascii=False,
        )
