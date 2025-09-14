def filter_regulations(regulations, user_input):
    """
    Filter regulations based on user input

    user_input = {
        'size': 150,        # Square meters
        'seats': 40,        # Number of seats
        'usesGas': True,    # Boolean
        'servesMeat': False # Boolean
    }
    """
    filtered = []

    for reg in regulations:
        # Always include critical regulations
        if reg.get("priority") == "critical":
            filtered.append(reg)
            continue

        # Check if regulation mentions gas
        if user_input.get("usesGas") and "גז" in reg.get("hebrew_text", ""):
            filtered.append(reg)
            continue

        # Check if regulation mentions meat
        if user_input.get("servesMeat") and "בשר" in reg.get("hebrew_text", ""):
            filtered.append(reg)
            continue

        # Size-based filtering
        if user_input.get("size", 0) > 100:
            if any(
                word in reg.get("hebrew_text", "") for word in ["גדול", "מטר", "שטח"]
            ):
                filtered.append(reg)
                continue

        # Capacity-based filtering
        if user_input.get("seats", 0) > 50:
            if any(
                word in reg.get("hebrew_text", "")
                for word in ["מקומות", "ישיבה", "תפוסה"]
            ):
                filtered.append(reg)

    # Remove duplicates while preserving order
    seen = set()
    unique_filtered = []
    for reg in filtered:
        if reg["id"] not in seen:
            seen.add(reg["id"])
            unique_filtered.append(reg)

    return unique_filtered
