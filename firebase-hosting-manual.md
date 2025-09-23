# Firebase Hosting - Komplette Anleitung

## Überblick
Firebase Hosting ist Googles Plattform für das Hosting von Web-Apps.

---

## Grundsetup (Einmalig)

### **Schritt 1: Node.js installieren**
1. Gehe zu: https://nodejs.org/
2. Download **LTS Version** (empfohlen)
3. Installieren wie normales Programm
4. **Computer neu starten**

### **Schritt 2: Firebase CLI installieren**
```bash
# PowerShell als Administrator öffnen
npm install -g firebase-tools

# Login zu Firebase
firebase login
```

**Troubleshooting PowerShell-Fehler:**
```bash
# Falls Execution Policy Fehler:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## **Firebase-Projekt erstellen**
1. Gehe zu: https://console.firebase.google.com/
2. **"Projekt hinzufügen"**
3. **Projektname** eingeben (z.B. "meine-app")
4. **Google Analytics** optional aktivieren
5. **"Projekt erstellen"**
6. **"App erstellen"**

---

### **Existierende HTML-App**
```bash
# In deinem App-Ordner
firebase init

# Wähle aus:
# ✅ Firestore (für Datenbank)
# ✅ Hosting (für Website)
# ❌ Rest nicht nötig für Anfang
```

**Firebase Setup-Fragen:**
- **Projekt:** "Use existing project" → Dein Projekt wählen
- **Firestore Rules:** `firestore.rules` (Standard)
- **Firestore Indexes:** `firestore.indexes.json` (Standard)
- **Public directory:** `public` (Standard)
- **Single-page app:** `No`
- **GitHub deployment:** `No` (erstmal überspringen)

## App deployen

### **Deployen:**
```bash
# Alles deployen
firebase deploy

```

### **Firestore-DB Regeln einstellen**
```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /foods/{document} {
      allow read, write: if true;
    }
    match /history/{document} {
      allow read, write: if true;
    }
  }
}

```
