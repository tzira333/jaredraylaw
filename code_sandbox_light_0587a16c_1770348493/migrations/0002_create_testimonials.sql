-- Migration: Create testimonials table
-- Created: 2026-01-22
-- Description: Stores client testimonials and reviews

DROP TABLE IF EXISTS testimonials;

CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    case_type TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    testimonial_text TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0 CHECK(approved IN (0, 1)),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create indexes
CREATE INDEX idx_testimonials_approved ON testimonials(approved);
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);
CREATE INDEX idx_testimonials_created ON testimonials(created_at DESC);