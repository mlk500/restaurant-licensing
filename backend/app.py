from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from services.regulation_filter import filter_regulations
from services.ai_service import generate_report as generate_ai_report
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app)

# Check if we have extracted data, otherwise use mock
data_file = "data/extracted_regulations.json"
if os.path.exists(data_file):
    with open(data_file, "r", encoding="utf-8") as f:
        REGULATIONS_DATA = json.load(f)
        print(
            f"Loaded {len(REGULATIONS_DATA.get('regulations', []))} regulations from extracted data"
        )
else:
    # Use empty for now
    REGULATIONS_DATA = {"regulations": []}
    print("No extracted data yet - run pdf_extractor.py first")


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "alive",
            "regulations_loaded": len(REGULATIONS_DATA.get("regulations", [])),
        }
    )


@app.route("/api/regulations", methods=["GET"])
def get_all_regulations():
    """Test endpoint to see all regulations"""
    return jsonify(REGULATIONS_DATA)


@app.route("/api/report", methods=["POST"])
def generate_report():
    """Main endpoint - receives user input and returns filtered regulations"""
    user_input = request.json

    # Filter regulations
    all_regulations = REGULATIONS_DATA.get("regulations", [])
    relevant_regulations = filter_regulations(all_regulations, user_input)

    # Generate AI report (returns JSON string)
    ai_report_json = generate_ai_report(relevant_regulations, user_input)

    # Parse the JSON
    try:
        ai_report = json.loads(ai_report_json)
    except:
        ai_report = {"summary": "Error parsing report", "requirements": []}

    return jsonify(
        {
            "user_input": user_input,
            "total_regulations": len(all_regulations),
            "relevant_regulations": len(relevant_regulations),
            "report": ai_report,  # Now it's structured JSON
            "raw_regulations": relevant_regulations,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5001)
