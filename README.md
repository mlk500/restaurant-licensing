# מערכת רישוי עסקים למסעדות 🍽️

## תיאור הפרויקט

מערכת אינטראקטיבית המסייעת לבעלי מסעדות בישראל להבין את דרישות הרישוי הרלוונטיות לעסק שלהם. המערכת מעבדת נתוני רגולציה גולמיים מקובצי PDF ממשלתיים, מסננת אותם בהתאם למאפייני העסק הספציפיים, ומייצרת דוח מותאם אישית בעברית פשוטה באמצעות בינה מלאכותית.

## 🎯 מטרות הפרויקט

- פישוט השפה המשפטית של דרישות הרישוי
- חיסכון בזמן ובעלויות יעוץ לבעלי עסקים
- הנגשת מידע רגולטורי בצורה ברורה ומעשית
- יצירת תוכנית פעולה מסודרת לקבלת רישיון עסק

## 🚀 הרצה מהירה

### דרישות מערכת

- Python 3.8+
- Node.js 16+
- חיבור אינטרנט (לשימוש ב-Gemini API)

### התקנת Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

# יצירת קובץ .env ב-backend

echo "GEMINI_API_KEY=your-api-key-here" > backend/.env

cd backend
python app.py

# Server runs on http://localhost:5001

cd frontend
npm install

cd frontend
npm run dev

# App opens on http://localhost:5173

📸 צילומי מסך

1. טופס הזנת נתונים ריק

![טופס הזנת נתונים ריק](docs/images/image.png)

2. טופס מלא עם תוצאות

![טופס מלא עם תוצאות](docs/images/image-1.png)

3. דוח מפורט
   ![דוח מפורט - חלק 1](docs/images/image-2.png)
   ![דוח מפורט - חלק 2](docs/images/image-3.png)

## 🏗️ ארכיטקטורת המערכת


```
                    📋 USER INPUT
                         │
                         ▼
        ┌─────────────────────────────────┐
        │    🖥️  React Frontend          │
        │    • TypeScript + Tailwind      │
        │    • Port 5173                  │
        │    • Business Form              │
        └─────────────────────────────────┘
                         │ HTTP POST
                         ▼
        ┌─────────────────────────────────┐
        │    🔧  Flask Backend            │
        │    • Python + Flask             │
        │    • Port 5001                  │
        │    • 3 API Endpoints            │
        └─────────────────────────────────┘
                    │         │
          ┌─────────┘         └─────────┐
          ▼                             ▼
    ┌──────────┐                ┌──────────────┐
    │ 📄 PDF   │                │ 🤖 Gemini   │
    │ Regs     │                │ AI API       │
    │ (JSON)   │                │ (Google)     │
    └──────────┘                └──────────────┘
```

### תהליך עבודה

1. **🎯 הזנת נתונים** - משתמש מזין פרטי עסק (גודל, מקומות, גז, בשר)
2. **🔍 סינון דרישות** - Backend מסנן 14 תקנות לפי מאפייני העסק
3. **🤖 עיבוד AI** - Gemini מתרגם טקסט משפטי לעברית פשוטה
4. **📋 דוח מותאם** - החזרת דוח עם עלויות, זמנים וטיפים מעשיים

## 📁 מבנה הפרויקט

```
restaurant-licensing/
├── backend/
│   ├── app.py                    # Flask server - נקודת כניסה ראשית
│   ├── requirements.txt          # Python dependencies
│   ├── services/
│   │   ├── pdf_extractor.py      # חילוץ נתונים מ-PDF
│   │   ├── regulation_filter.py  # לוגיקת סינון דרישות
│   │   └── ai_service.py         # אינטגרציה עם Gemini AI
│   └── data/
│       ├── restaurant_regulations.pdf  # קובץ מקור
│       └── extracted_regulations.json  # נתונים מעובדים
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # קומפוננטה ראשית
│   │   ├── components/
│   │   │   └── ReportDisplay.tsx # תצוגת דוח
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── lib/
│   │       └── utils.ts          # Utility functions
│   ├── package.json
│   └── tailwind.config.js       # Tailwind CSS configuration
│
└── docs/
    └── images/                   # צילומי מסך
```

## 📚 תיעוד API

> **For detailed implementation, see:** `backend/app.py`

### Endpoints

#### `GET /api/health`

**Purpose:** Health check endpoint to verify server status and loaded data

**Response:**

```json
{
  "status": "alive",
  "regulations_loaded": 14
}
```

**Usage:** Used by frontend and monitoring tools to ensure the backend is running and has successfully loaded regulation data from the JSON file.

---

#### `POST /api/report`

**Purpose:** Main endpoint that generates personalized licensing reports

**Request Body:**

```json
{
  "size": 150, // Restaurant size in square meters
  "seats": 40, // Number of seating places
  "usesGas": true, // Whether restaurant uses gas equipment
  "servesMeat": false // Whether restaurant serves meat products
}
```

**Response:**

```json
{
  "user_input": {
    "size": 150,
    "seats": 40,
    "usesGas": true,
    "servesMeat": false
  },
  "total_regulations": 14,      // Total regulations in database
  "relevant_regulations": 3,    // Number of regulations that apply
  "report": {                   // AI-generated structured report
    "summary": "...",
    "requirements": [...]
  },
  "raw_regulations": [...]      // Original filtered regulation objects
}
```

**Process:**

1. Receives business characteristics from frontend
2. Filters all regulations using `filter_regulations()` function
3. Sends filtered regulations to AI service for processing
4. Returns structured report with user-friendly Hebrew explanations

---

#### `GET /api/regulations`

**Purpose:** Development/testing endpoint to view all loaded regulations

**Response:**

```json
{
  "regulations": [
    {
      "id": 1,
      "category": "health",
      "hebrew_text": "...",
      "source_page": "page_3",
      "priority": "critical"
    }
    // ... 13 more regulations
  ]
}
```

**Usage:** Primarily for debugging and development to inspect the loaded regulation data from `extracted_regulations.json`.

## 🔧 Technologies

### Backend

- **Flask** - Web framework
- **PyPDF2** - PDF processing
- **Google Generative AI** - Gemini API client
- **python-dotenv** - Environment variables

### Frontend

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React-to-print** - PDF export

## 🤖 AI Integration

### Primary AI Model - Google Gemini 1.5 Flash

**Why chosen:**

- Excellent Hebrew language support
- Free API for developers (60 calls/minute)
- Fast response times
- Long context understanding

**Core prompt for report generation:**

```python
prompt = f"""
You are a professional business licensing consultant in Israel.

Business details:
- Size: {size} sqm
- Seats: {seats}
- Uses gas: {usesGas}
- Serves meat: {servesMeat}

Relevant regulations from law:
{regulations}

Your task:
1. Translate requirements to simple, clear Hebrew
2. Order by importance (critical / important / recommended)
3. Add practical tips for each requirement
4. Estimate costs and timeframes
5. Use encouraging and friendly tone

Create an organized and readable report in Hebrew.
"""
```

## 🛠️ Built with Claude Code

This project was developed using **Claude Code** for agentic coding assistance. Claude Code provided:

- **Architecture Planning** - System design and component structure
- **Code Implementation** - Full-stack development with React/Flask
- **Problem Solving** - Solutions for Hebrew text processing and API integration
- **Documentation** - Comprehensive README and code documentation

The AI-assisted development approach enabled rapid prototyping and iteration, particularly useful for handling complex requirements like Hebrew text processing and government PDF parsing.
