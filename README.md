https://console.firebase.google.com/project/ernahrungs-tracker/overview

How I pushed it into GitHub: https://claude.ai/chat/e049ee10-0bea-46b5-892b-bb5a483fddc8

How the app was created: https://claude.ai/chat/7e463265-6ee5-4a0e-a518-79ace9419355

## **TODO**
- Data self-deleting after around 90 Day
- Favorite Food
-- Introduction of deletion and editing
-- Showing how much was eaten in the last 90 days (because of deletion)
-- Quantity ?
- Export of last 90 days to .csv-file
- Easier UI
- Improve Stats-Function
- Editable Time of eaten food
- "Gönnung" implementieren, als "Food" und Stats

## **Workflow für Änderungen: GitHub + Firebase**

### 1. **Änderungen zu GitHub pushen**
```cmd
# Alle Änderungen anzeigen
git status

# Alle geänderten Dateien hinzufügen
git add .

# Commit mit Beschreibung
git commit -m "Beschreibung deiner Änderungen"

# Zu GitHub hochladen
git push
```

### 2. **Zu Firebase deployen**
```cmd
# Firebase Login (einmalig)
firebase login

# Deploy zu Firebase Hosting
firebase deploy
```

## **Kompletter Beispiel-Workflow:**

```cmd
# 1. Änderungen gemacht? Schauen was geändert wurde:
git status

# 2. Zu GitHub:
git add .
git commit -m "Feature: Neue Kalorienzähler-Funktion hinzugefügt"
git push

# 3. Zu Firebase:
firebase deploy
```
