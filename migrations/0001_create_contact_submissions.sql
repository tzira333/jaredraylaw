-- Migration: Create contact_submissions table
-- Created: 2026-01-22
-- Description: Stores all contact form submissions from potential clients

DROP TABLE IF EXISTS contact_submissions;

CREATE TABLE contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL CHECK(service IN ('family', 'bankruptcy', 'estate', 'injury', 'traffic', 'other')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'closed')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_email ON contact_submissions(email);