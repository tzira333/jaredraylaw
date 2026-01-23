-- Seed data for testimonials
-- This adds the initial testimonials that are displayed on the website

INSERT INTO testimonials (id, client_name, case_type, rating, testimonial_text, approved, created_at, updated_at) VALUES
(
    'test-001',
    'Sarah M.',
    'Family Law Client',
    5,
    'Jared was incredibly professional and kept me informed throughout my entire case. His expertise made all the difference, and I couldn''t be happier with the outcome!',
    1,
    strftime('%s', 'now') * 1000,
    strftime('%s', 'now') * 1000
),
(
    'test-002',
    'Michael T.',
    'Bankruptcy Client',
    5,
    'I was overwhelmed with debt, but Jared walked me through the bankruptcy process step by step. He was patient, understanding, and helped me get a fresh financial start.',
    1,
    strftime('%s', 'now') * 1000,
    strftime('%s', 'now') * 1000
),
(
    'test-003',
    'Jennifer L.',
    'Personal Injury Client',
    5,
    'After my accident, Jared fought hard to get me fair compensation. He was responsive, knowledgeable, and truly cared about my recovery. Highly recommend!',
    1,
    strftime('%s', 'now') * 1000,
    strftime('%s', 'now') * 1000
);