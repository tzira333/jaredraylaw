/**
 * Cloudflare Worker for Jared Ray Law Website
 * Handles D1 database operations and serves static assets
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for API requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (path.startsWith('/api/')) {
      try {
        // Contact Submissions API
        if (path === '/api/contact' && request.method === 'POST') {
          return await handleContactSubmission(request, env, corsHeaders);
        }
        
        if (path === '/api/contacts' && request.method === 'GET') {
          return await handleGetContacts(request, env, corsHeaders);
        }

        if (path.match(/^\/api\/contact\/[\w-]+$/) && request.method === 'GET') {
          const id = path.split('/').pop();
          return await handleGetContact(id, env, corsHeaders);
        }

        if (path.match(/^\/api\/contact\/[\w-]+$/) && request.method === 'PATCH') {
          const id = path.split('/').pop();
          return await handleUpdateContact(id, request, env, corsHeaders);
        }

        if (path.match(/^\/api\/contact\/[\w-]+$/) && request.method === 'DELETE') {
          const id = path.split('/').pop();
          return await handleDeleteContact(id, env, corsHeaders);
        }

        // Testimonials API
        if (path === '/api/testimonials' && request.method === 'GET') {
          return await handleGetTestimonials(request, env, corsHeaders);
        }

        if (path === '/api/testimonial' && request.method === 'POST') {
          return await handleCreateTestimonial(request, env, corsHeaders);
        }

        return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
      } catch (error) {
        console.error('API Error:', error);
        return jsonResponse({ error: error.message }, 500, corsHeaders);
      }
    }

    // Serve static files (HTML, CSS, JS, etc.)
    return env.ASSETS.fetch(request);
  },
};

// ========================================
// CONTACT SUBMISSION HANDLERS
// ========================================

async function handleContactSubmission(request, env, corsHeaders) {
  const data = await request.json();
  
  // Validate required fields
  const { name, email, phone, service, message } = data;
  if (!name || !email || !phone || !message) {
    return jsonResponse({ error: 'Missing required fields' }, 400, corsHeaders);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: 'Invalid email format' }, 400, corsHeaders);
  }

  // Generate UUID for ID
  const id = crypto.randomUUID();
  const timestamp = Date.now();

  // Insert into database
  const stmt = env.DB.prepare(
    `INSERT INTO contact_submissions 
    (id, name, email, phone, service, message, status, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  );

  await stmt.bind(
    id,
    name,
    email,
    phone,
    service || 'other',
    message,
    timestamp,
    timestamp
  ).run();

  // Return the created record
  const record = {
    id,
    name,
    email,
    phone,
    service: service || 'other',
    message,
    status: 'new',
    created_at: timestamp,
    updated_at: timestamp
  };

  return jsonResponse(record, 201, corsHeaders);
}

async function handleGetContacts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
  const offset = (page - 1) * limit;
  const search = url.searchParams.get('search') || '';
  const sort = url.searchParams.get('sort') || '-created_at';

  let query = 'SELECT * FROM contact_submissions';
  let countQuery = 'SELECT COUNT(*) as total FROM contact_submissions';
  const params = [];

  // Add search filter
  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ? OR message LIKE ?';
    countQuery += ' WHERE name LIKE ? OR email LIKE ? OR message LIKE ?';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Add sorting
  const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
  const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  // Add pagination
  query += ` LIMIT ? OFFSET ?`;

  // Get total count
  const countResult = await env.DB.prepare(countQuery).bind(...params).first();
  const total = countResult.total;

  // Get paginated results
  const results = await env.DB.prepare(query)
    .bind(...params, limit, offset)
    .all();

  return jsonResponse({
    data: results.results,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  }, 200, corsHeaders);
}

async function handleGetContact(id, env, corsHeaders) {
  const stmt = env.DB.prepare('SELECT * FROM contact_submissions WHERE id = ?');
  const result = await stmt.bind(id).first();

  if (!result) {
    return jsonResponse({ error: 'Contact not found' }, 404, corsHeaders);
  }

  return jsonResponse(result, 200, corsHeaders);
}

async function handleUpdateContact(id, request, env, corsHeaders) {
  const data = await request.json();
  const timestamp = Date.now();

  // Build update query dynamically based on provided fields
  const allowedFields = ['status', 'name', 'email', 'phone', 'service', 'message'];
  const updates = [];
  const params = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(data[field]);
    }
  }

  if (updates.length === 0) {
    return jsonResponse({ error: 'No fields to update' }, 400, corsHeaders);
  }

  updates.push('updated_at = ?');
  params.push(timestamp);
  params.push(id);

  const stmt = env.DB.prepare(
    `UPDATE contact_submissions SET ${updates.join(', ')} WHERE id = ?`
  );

  await stmt.bind(...params).run();

  // Return updated record
  const updated = await env.DB.prepare('SELECT * FROM contact_submissions WHERE id = ?')
    .bind(id)
    .first();

  return jsonResponse(updated, 200, corsHeaders);
}

async function handleDeleteContact(id, env, corsHeaders) {
  const stmt = env.DB.prepare('DELETE FROM contact_submissions WHERE id = ?');
  await stmt.bind(id).run();

  return new Response(null, { 
    status: 204,
    headers: corsHeaders 
  });
}

// ========================================
// TESTIMONIALS HANDLERS
// ========================================

async function handleGetTestimonials(request, env, corsHeaders) {
  const url = new URL(request.url);
  const approvedOnly = url.searchParams.get('approved') !== 'false';
  const limit = parseInt(url.searchParams.get('limit') || '10');

  let query = 'SELECT * FROM testimonials';
  
  if (approvedOnly) {
    query += ' WHERE approved = 1';
  }
  
  query += ' ORDER BY created_at DESC LIMIT ?';

  const results = await env.DB.prepare(query).bind(limit).all();

  return jsonResponse({
    data: results.results,
    total: results.results.length
  }, 200, corsHeaders);
}

async function handleCreateTestimonial(request, env, corsHeaders) {
  const data = await request.json();
  
  const { client_name, case_type, rating, testimonial_text } = data;
  if (!client_name || !case_type || !rating || !testimonial_text) {
    return jsonResponse({ error: 'Missing required fields' }, 400, corsHeaders);
  }

  if (rating < 1 || rating > 5) {
    return jsonResponse({ error: 'Rating must be between 1 and 5' }, 400, corsHeaders);
  }

  const id = crypto.randomUUID();
  const timestamp = Date.now();

  const stmt = env.DB.prepare(
    `INSERT INTO testimonials 
    (id, client_name, case_type, rating, testimonial_text, approved, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)`
  );

  await stmt.bind(
    id,
    client_name,
    case_type,
    rating,
    testimonial_text,
    timestamp,
    timestamp
  ).run();

  const record = {
    id,
    client_name,
    case_type,
    rating,
    testimonial_text,
    approved: false,
    created_at: timestamp,
    updated_at: timestamp
  };

  return jsonResponse(record, 201, corsHeaders);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  });
}