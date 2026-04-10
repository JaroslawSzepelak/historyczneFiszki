# Historyczne Fiszki

Aplikacja do nauki historii w dwóch trybach:

- **Nauka** (czytanie i fiszki do utrwalania),
- **Testy** (pytania wielokrotnego wyboru z zapamiętywaniem sesji).

Projekt jest podzielony na:

- `frontend/` - Vue 3 + Vue Router + Vuex,
- `backend/` - Node.js + Express + MySQL.

## Wymagania

- Node.js 18+ (zalecane),
- npm,
- MySQL 8+.

## Struktura projektu

```text
historycznefiszki/
  backend/
  frontend/
  README.md
```

## Szybki start (development)

### 1) Backend

```bash
cd backend
npm install
```

Skopiuj konfigurację środowiska:

```bash
cp .env.example .env
```

Na Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Następnie uzupełnij dane połączenia z bazą w `backend/.env`.

Uruchom backend:

```bash
npm run dev
```

Backend domyślnie działa na `http://localhost:3000`.

### 2) Frontend

W nowym terminalu:

```bash
cd frontend
npm install
npm run serve
```

Frontend domyślnie działa na `http://localhost:8080`.

## Konfiguracja backendu (`backend/.env`)

Najważniejsze zmienne:

- `PORT` - port backendu (domyślnie `3000`),
- `NODE_ENV` - `development` / `production`,
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
- `DB_CONNECTION_LIMIT` - limit połączeń puli MySQL,
- `CORS_ORIGINS` - dozwolone originy rozdzielone przecinkami,
- `RATE_LIMIT_MAX` - limit requestów na 15 minut dla `/api/*`.

Przykład znajduje się w `backend/.env.example`.

## Endpointy API (fiszki)

Bazowy URL: `http://localhost:3000/api`

- `GET /health` - status backendu i bazy.
- `GET /flashcards` - lista fiszek.
  - Obsługiwane query params:
    - `area`, `era` - filtrowanie,
    - `q` - wyszukiwanie po treści pytania,
    - `sortBy` - `id | area | era | question`,
    - `order` - `asc | desc`,
    - `page`, `limit` - paginacja.
- `GET /flashcards/:id` - pojedyncza fiszka.
- `POST /flashcards` - utworzenie fiszki.
- `PUT /flashcards/:id` - pełna aktualizacja.
- `PATCH /flashcards/:id` - częściowa aktualizacja.
- `DELETE /flashcards/:id` - usunięcie fiszki.

### Przykładowy payload `POST /flashcards`

```json
{
  "area": "swiat",
  "era": "sredniowiecze",
  "question": "Kto wynalazł druk?",
  "answers": ["Jan Gutenberg", "Leonardo da Vinci", "Galileusz"],
  "correctAnswer": "Jan Gutenberg"
}
```

## Kompatybilność ze starym frontendem

`GET /api/flashcards`:

- bez `page` i `limit` zwraca tablicę (stary format),
- z `page` i `limit` zwraca obiekt `{ data, pagination }`.

Dzięki temu obecny frontend nadal działa bez zmian.

## Bezpieczeństwo i obserwowalność backendu

W backendzie aktywne są:

- `helmet` (nagłówki bezpieczeństwa),
- `cors` (konfigurowane originy),
- `express-rate-limit` (ochrona przed floodem),
- limit rozmiaru JSON body (`50kb`),
- `morgan` (logowanie requestów),
- centralny handler błędów i `404` dla nieistniejących endpointów.

## Przydatne komendy

### Frontend

```bash
cd frontend
npm run serve
npm run build
npm run lint
```

### Backend

```bash
cd backend
npm run dev
npm run start
```
