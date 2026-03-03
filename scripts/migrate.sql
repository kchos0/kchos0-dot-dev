-- Migration: create articles and projects tables
-- Run via: turso db shell <db-name> < scripts/migrate.sql

CREATE TABLE IF NOT EXISTS articles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    UNIQUE NOT NULL,
  title       TEXT    NOT NULL,
  description TEXT,
  date        TEXT    NOT NULL,
  featured    INTEGER NOT NULL DEFAULT 0, -- 0 = false, 1 = true
  hidden      INTEGER NOT NULL DEFAULT 0, -- 0 = visible, 1 = hidden
  content     TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    UNIQUE NOT NULL,
  title       TEXT    NOT NULL,
  description TEXT,
  url         TEXT,
  date        TEXT    NOT NULL,
  featured    INTEGER NOT NULL DEFAULT 0, -- 0 = false, 1 = true
  hidden      INTEGER NOT NULL DEFAULT 0, -- 0 = visible, 1 = hidden
  content     TEXT
);
