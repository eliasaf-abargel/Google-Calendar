# CI Workflow — סיכום הבעיות, האבחון והתיקון

מסמך זה מסביר **מה נמצא, מה הוסק ואיך בוצע כל תיקון** בקובץ
`.github/workflows/ci.yaml` (ובמחיקת הקובץ הכפול
`.github/workflows/ci-google-calendar.yml`).

---

## סקירה מהירה — 5 בעיות, 5 תיקונים

| # | בעיה | היכן ראיתי אותה | התיקון |
|---|------|-----------------|--------|
| 1 | `JF_URL` ו-`DOCKER_REGISTRY` ריקים → קריסת nil-pointer | לוג CI | הוספת ערכי ברירת-מחדל hardcoded |
| 2 | OIDC לא מוגדר ב-JFrog → 404 | לוג CI | מעבר ל-`JF_ACCESS_TOKEN` רגיל |
| 3 | heredoc לא מוגן → bash מריץ SHA כפקודה | לוג CI | שינוי `<<EOF` ל-`<<'EOF'` |
| 4 | `oidc-token` output תמיד ריק → build-args ריקים | נגזר מבעיה 2 | החלפה ב-`secrets.JF_ACCESS_TOKEN` |
| 5 | שני קבצי workflow כפולים | קבצי repo | מחיקת `ci-google-calendar.yml` |

---

## בעיה 1 — משתני סביבה ריקים גרמו לקריסת nil-pointer

### מה נמצא בלוג

```
JF_URL:          (ריק)
DOCKER_REGISTRY: (ריק)
...
panic: runtime error: invalid memory address or nil pointer dereference
  github.com/jfrog/jfrog-cli-artifactory/.../image.go:56
```

### מה הוסק

הקובץ המקורי הגדיר:

```yaml
JF_URL:          ${{ vars.JFROG_URL }}
DOCKER_REGISTRY: ${{ vars.JFROG_DOCKER_REGISTRY }}
```

משתני ה-`vars` (repository variables) לא הוגדרו בהגדרות ה-repo.
כשהמשתנים ריקים, ה-JFrog CLI מקבל מחרוזת ריקה ופועל על pointer לא מאותחל →
panic.

### התיקון

```yaml
# לפני
JF_URL:          ${{ vars.JFROG_URL }}
DOCKER_REGISTRY: ${{ vars.JFROG_DOCKER_REGISTRY }}

# אחרי
JF_URL:          ${{ vars.JFROG_URL || 'https://frogops1.jfrog.io' }}
DOCKER_REGISTRY: ${{ vars.JFROG_DOCKER_REGISTRY || 'frogops1.jfrog.io' }}
```

**מדוע ה-fallback הספציפי הזה?** הערכים `frogops1.jfrog.io` היו כבר hardcoded
בקובץ הישן `ci-google-calendar.yml` — כלומר אלו הערכים הנכונים לסביבה הזו. הוספנו
אותם כ-fallback כדי שאם ה-vars אי פעם יוגדרו הם ישתמשו בהם, ואם לא — ה-workflow
עדיין יפעל.

---

## בעיה 2 — OIDC לא מוגדר ב-JFrog → שגיאת 404

### מה נמצא בלוג

```
[Error] failed to exchange OIDC token: server response: 404 Not Found
{
  "errors": [{ "code": "NOT_FOUND", "message": "oidc integration doesn't exist" }]
}
##[error]JFrog CLI exited with exit code 1
```

### מה הוסק

הקובץ המקורי השתמש באימות OIDC — מנגנון שמחייב הגדרה מיוחדת בצד ה-JFrog:

```yaml
# לפני — בכל 3 ה-jobs
- name: Setup JFrog CLI (OIDC)
  uses: jfrog/setup-jfrog-cli@v4
  with:
    oidc-provider-name: github      # ← דורש integration שלא קיים
    oidc-audience: jfrog-github
  env:
    JF_URL: ${{ env.JF_URL }}
```

שגיאת 404 מ-JFrog אומרת שה-OIDC provider בשם `github` פשוט לא קיים
בהגדרות ה-JFrog instance. לכן יש לעבור לאימות קלאסי עם Access Token.

### התיקון

```yaml
# אחרי — בכל 3 ה-jobs
- name: Setup JFrog CLI
  uses: jfrog/setup-jfrog-cli@v4
  env:
    JF_URL: ${{ env.JF_URL }}
    JF_ACCESS_TOKEN: ${{ secrets.JF_ACCESS_TOKEN }}
    JFROG_CLI_AVOID_NEW_VERSION_WARNING: "true"
```

בנוסף הוסרה ה-permission שלא נחוצה יותר:

```yaml
# לפני
permissions:
  contents: read
  id-token: write   # ← נדרש רק ל-OIDC

# אחרי
permissions:
  contents: read
```

**מדוע `id-token: write` הוסרה?** Permission זו מאפשרת ל-job לבקש OIDC
token מ-GitHub. כשעוברים לאימות קלאסי אין לכך צורך, וזה מצמצם את הרשאות
ה-workflow (עיקרון של least privilege).

---

## בעיה 3 — heredoc לא מוגן גרם ל-bash לנסות להריץ commit SHA

### מה נמצא בלוג

```bash
/home/runner/work/_temp/xxx.sh: line 1:
  fccc21243de5f655e31763341ef4c8d816314fa4: command not found
```

### מה הוסק

ה-Build Summary בקובץ המקורי השתמש ב-heredoc ללא גרשיים:

```yaml
# לפני
run: |
  cat <<EOF >> $GITHUB_STEP_SUMMARY
  | **Commit**| `${{ github.sha }}` |
  EOF
```

**מה שקרה בפועל:**
1. GitHub Actions מרחיב `${{ github.sha }}` → `fccc2124...`
2. ה-string שמגיע ל-bash הוא: `| **Commit**| <backtick>fccc2124...<backtick> |`
3. ב-heredoc **ללא** גרשיים, bash מפרש backtick כ-command substitution
4. bash מנסה להריץ `fccc2124...` כפקודה → command not found

### התיקון

```yaml
# אחרי
run: |
  cat <<'EOF' >> $GITHUB_STEP_SUMMARY
  | **Commit**| `${{ github.sha }}` |
  EOF
```

ה-`'EOF'` עם גרשיים בודדות אומר ל-bash: **אל תפרש backticks, dollar signs וכו'
בתוכן ה-heredoc** — הכל יועבר כ-literal string.

---

## בעיה 4 — build-args לקבלת NPM token תמיד ריקים

### מה הוסק (נגזר מבעיה 2)

לאחר שה-OIDC נכשל (בעיה 2), כל שימוש ב-`steps.setup-jfrog-cli.outputs.oidc-token`
מחזיר מחרוזת ריקה. הקובץ השתמש ב-output הזה כ-build arg ל-Docker:

```yaml
# לפני
--build-arg "NPM_AUTH_TOKEN=${{ steps.setup-jfrog-cli.outputs.oidc-token }}"
--build-arg "NPM_PASS=${{ steps.setup-jfrog-cli.outputs.oidc-token }}"
```

כלומר ה-Docker build קיבל token ריק, מה שגרם גם לו להיכשל.

### התיקון

```yaml
# אחרי
--build-arg "NPM_AUTH_TOKEN=${{ secrets.JF_ACCESS_TOKEN }}"
--build-arg "NPM_PASS=${{ secrets.JF_ACCESS_TOKEN }}"
```

**מדוע שני ה-args?** `NPM_AUTH_TOKEN` ו-`NPM_PASS` הם שמות שונים של `ARG`
שמוגדרים ב-Dockerfile — שניהם נחוצים כי חלקים שונים בתהליך ה-build דורשים
כל אחד שם שונה.

---

## בעיה 5 — שני קבצי workflow כפולים

### מה נמצא

בתיקיית `.github/workflows/` היו **שני קבצים** שמבצעים את אותה העבודה:

| קובץ | מצב |
|------|-----|
| `ci.yaml` | הגרסה החדשה והמתוקנת |
| `ci-google-calendar.yml` | גרסה ישנה עם בעיות ולוגיקה שונה |

שני הקבצים מאזינים לאותם triggers (`push` ו-`pull_request` על `dev`).
זה אומר שכל push/PR הפעיל **שני** workflow runs במקביל — כפל מיותר.

### התיקון

מחיקת `ci-google-calendar.yml` — הקובץ `ci.yaml` הוא הגרסה הנכונה
והמלאה (כולל Xray scan, build info, cloud distribution).

---

## תיאור הזרימה הנכונה לאחר התיקון

```
push/PR → dev branch
          │
          ├── pull_request  →  [validate job]
          │                    checkout → jf setup (token) → docker login
          │                    → docker build (no push) → PR summary
          │
          └── push / manual →  [build job]
                               checkout → jf setup (token) → docker login
                               → set tag → docker build → docker push
                               → xray scan → xray gate
                               → publish build-info → build summary
                                     │
                                     └── xray passed + branch=dev
                                               ↓
                                         [release job]
                                         jf setup → docker login
                                         → promote image → cloud distribution
```

---

## הגדרות נדרשות ב-Repository Settings

כדי שה-workflow יפעל, יש להגדיר ב-**Settings → Secrets and variables**:

### Secrets (חובה)
| שם | תיאור |
|----|-------|
| `JF_ACCESS_TOKEN` | JFrog Access Token עם הרשאות read/write ל-Docker registry |

### Variables (אופציונלי — יש fallback)
| שם | ערך ברירת-מחדל | תיאור |
|----|----------------|-------|
| `JFROG_URL` | `https://frogops1.jfrog.io` | כתובת ה-JFrog instance |
| `JFROG_DOCKER_REGISTRY` | `frogops1.jfrog.io` | כתובת ה-Docker registry |
| `BASE_REPO` | `docker-virtual` | שם ה-virtual repo ל-base images |
| `NPM_USER` | `token` | שם משתמש ל-NPM registry |
