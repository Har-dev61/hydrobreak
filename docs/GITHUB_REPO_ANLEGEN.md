# HydroBreak als Repo auf GitHub anlegen

So bringst du dein Projekt in deinen GitHub-Account.

---

## 1. Neues Repository auf GitHub erstellen

1. Einloggen auf [github.com](https://github.com).
2. Oben rechts **„+”** → **„New repository“**.
3. Einstellungen:
   - **Repository name:** z. B. `hydrobreak`
   - **Description:** optional (z. B. „Trink- und Pausen-Erinnerungen“)
   - **Public** oder **Private**
   - **„Add a README“**, **.gitignore**, **License** **nicht** ankreuzen (Projekt existiert schon lokal).
4. **„Create repository“** klicken.  
   GitHub zeigt dir danach eine URL wie `https://github.com/DEIN-USERNAME/hydrobreak.git`.

---

## 2. Lokales Projekt mit Git verbinden und pushen

Im Terminal im **Projektordner** (z. B. `~/Desktop/coding/hydrobreak`):

```bash
# Ins Projektverzeichnis wechseln
cd /Users/haruncan/Desktop/coding/hydrobreak

# Git initialisieren
git init

# Alle Dateien zur Staging-Area hinzufügen (.gitignore schließt Unerwünschtes aus)
git add .

# Ersten Commit
git commit -m "Initial commit: HydroBreak App"

# GitHub als Remote hinzufügen (DEIN-USERNAME und REPO-NAME anpassen!)
git remote add origin https://github.com/DEIN-USERNAME/hydrobreak.git

# Branch auf main setzen (falls nötig) und pushen
git branch -M main
git push -u origin main
```

**Hinweis:** Ersetze `DEIN-USERNAME` durch deinen GitHub-Benutzernamen und `hydrobreak` durch den exakten Repo-Namen, falls du einen anderen gewählt hast.

---

## 3. Bei „Permission denied“ oder HTTPS-Login

- **HTTPS:** Beim ersten `git push` fragt GitHub nach Benutzername und Passwort.  
  „Passwort“ = ein **Personal Access Token** (Settings → Developer settings → Personal access tokens), nicht dein GitHub-Login-Passwort.
- **SSH:** Wenn du SSH nutzt, Remote mit SSH-URL setzen:
  ```bash
  git remote add origin git@github.com:DEIN-USERNAME/hydrobreak.git
  ```

---

## 4. Danach

- Repo ist unter `https://github.com/DEIN-USERNAME/hydrobreak` sichtbar.
- Weitere Änderungen: `git add .` → `git commit -m "Beschreibung"` → `git push`.
- Dieses Repo kannst du in Render, Netlify, Railway usw. verbinden.
