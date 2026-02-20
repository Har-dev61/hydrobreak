# Sign in with Apple aktivieren

Damit „Mit Apple anmelden“ in HydroBreak funktioniert, musst du einen **Services ID** bei Apple anlegen und die Umgebungsvariablen setzen.

## 1. Apple Developer Account

- Du brauchst ein [Apple Developer](https://developer.apple.com/account/) Konto (kostenpflichtig, ca. 99 €/Jahr).
- Erstelle eine **App ID** (z. B. `de.example.hydrobreak`) unter **Certificates, Identifiers & Profiles** → **Identifiers** → **+** → **App IDs**.

## 2. Sign in with Apple für die App ID

- Öffne deine **App ID** → **Sign in with Apple** aktivieren („Enable as a primary App ID“ oder „Group with an existing primary App ID“).
- Speichern.

## 3. Services ID (für Web) anlegen

- **Identifiers** → **+** → **Services IDs** wählen.
- **Description:** z. B. „HydroBreak Web“
- **Identifier:** z. B. `de.example.hydrobreak` (oder deine Bundle-ID + `.web`). Das ist deine **Client ID** / **Services ID**.
- **Sign in with Apple** aktivieren → **Configure**:
  - **Primary App ID:** deine zuvor erstellte App ID wählen.
  - **Domains and Subdomains:** deine Web-Domain, z. B. `hydrobreak.example.com` (ohne `https://`). Für lokale Entwicklung: `localhost`.
  - **Return URLs:** die exakte URL, zu der Apple nach der Anmeldung zurückleitet. Muss mit deiner Domain übereinstimmen.
    - Produktion: z. B. `https://hydrobreak.example.com`
    - Lokal: `http://localhost:5173` (oder dein Vite-Port).
- Speichern.

## 4. Umgebungsvariablen

### Backend (`server/.env`)

```env
# Services ID aus Schritt 3 (Identifier der Services ID)
APPLE_CLIENT_ID=de.example.hydrobreak
```

### Frontend (Projektroot `.env`)

```env
# Gleicher Wert wie APPLE_CLIENT_ID im Backend
VITE_APPLE_CLIENT_ID=de.example.hydrobreak

# Optional: Return URL, die in Apple eingetragen ist. Standard: aktuelle Origin (z. B. http://localhost:5173)
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

- **VITE_APPLE_CLIENT_ID** muss exakt der **Identifier** deiner Services ID sein.
- **VITE_APPLE_REDIRECT_URI** muss **genau** mit einer der **Return URLs** in der Apple Services ID übereinstimmen (inkl. Schema und Port). Wenn du es weglässt, wird `window.location.origin` verwendet.

## 5. Testen

1. Backend starten: `cd server && npm run dev`
2. Frontend starten: `npm run dev`
3. Einstellungen → „Anmelden / Registrieren“ → „Mit Apple anmelden“ klicken.
4. Im Popup mit Apple-ID anmelden. Beim ersten Mal kannst du „Name und E-Mail teilen“ wählen; danach erhält die App nur noch den Token.

## Häufige Fehler

- **„Apple-Anmeldung ist nicht konfiguriert“**: `APPLE_CLIENT_ID` im Backend fehlt oder ist leer.
- **„Ungültiger Apple-Token“**: Die **aud** (Audience) im Token entspricht nicht der Services ID. Prüfe, dass Backend und Frontend exakt dieselbe Services ID (z. B. `de.example.hydrobreak`) nutzen.
- **Popup schließt ohne Rückkehr**: Return URL in Apple Developer muss exakt die gleiche sein wie `VITE_APPLE_REDIRECT_URI` bzw. die aktuelle Origin (z. B. `http://localhost:5173`).
- **Domain nicht gültig**: Unter der Services ID müssen Domain und Return URL validiert sein; für `localhost` funktioniert es nur in Safari bzw. nach Apple-Vorgaben für lokale Tests.

## Referenzen

- [Sign in with Apple (Web)](https://developer.apple.com/sign-in-with-apple/)
- [Configuring your webpage for Sign in with Apple](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuration)
