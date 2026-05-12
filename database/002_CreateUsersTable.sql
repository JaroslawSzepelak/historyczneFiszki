-- Skrypt SQL do utworzenia tabeli użytkowników dla aplikacji Historyczne Fiszki
-- Uruchom ten skrypt w MySQL Workbench po połączeniu z bazą danych

-- Wybierz bazę danych (zmień nazwę jeśli potrzeba)
USE historycznefiszki;

-- Utwórz tabelę użytkowników
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unikalny identyfikator użytkownika',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Adres email użytkownika (unikalny)',
    username VARCHAR(50) UNIQUE COMMENT 'Nazwa użytkownika (opcjonalna, unikalna)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Zahashowane hasło (np. bcrypt)',
    first_name VARCHAR(100) COMMENT 'Imię użytkownika',
    last_name VARCHAR(100) COMMENT 'Nazwisko użytkownika',
    is_admin TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Flaga administratora: 0 - zwykły użytkownik, 1 - admin',
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active' COMMENT 'Status konta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data utworzenia konta',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data ostatniej aktualizacji',
    last_login TIMESTAMP NULL COMMENT 'Data ostatniego logowania',
    email_verified TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Czy email został zweryfikowany: 0 - nie, 1 - tak',
    verification_token VARCHAR(255) COMMENT 'Token weryfikacyjny dla email',
    reset_password_token VARCHAR(255) COMMENT 'Token do resetowania hasła',
    reset_token_expires TIMESTAMP NULL COMMENT 'Data wygaśnięcia tokenu resetowania',
    preferences JSON COMMENT 'Preferencje użytkownika (np. ustawienia interfejsu) w formacie JSON',
    progress JSON COMMENT 'Postęp nauki użytkownika (np. ukończone lekcje) w formacie JSON',
    updated_by INT COMMENT 'ID użytkownika, który dokonał ostatniej modyfikacji (NULL jeśli system lub automatycznie)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela przechowująca dane użytkowników aplikacji Historyczne Fiszki';

-- Indeksy dla optymalizacji zapytań
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_status ON users(status);
CREATE INDEX idx_is_admin ON users(is_admin);
CREATE INDEX idx_updated_by ON users(updated_by);

-- Przykład wstawienia danych testowych (usuń w produkcji)
-- INSERT INTO users (email, username, password_hash, first_name, last_name, is_admin, status, email_verified)
-- VALUES ('admin@example.com', 'admin', '$2b$10$hashedpassword', 'Admin', 'User', 1, 'active', 1),
--        ('user@example.com', 'testuser', '$2b$10$hashedpassword', 'Test', 'User', 0, 'active', 1);