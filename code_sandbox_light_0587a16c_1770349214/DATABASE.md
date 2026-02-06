# Database Schema Documentation

## Overview

This project uses the **RESTful Table API** for data storage. Two tables have been configured to store contact form submissions and testimonials.

---

## 📊 **Table Schemas**

### **1. contact_submissions**

Stores all contact form submissions from potential clients.

| Field Name | Type | Description | Options/Constraints |
|------------|------|-------------|---------------------|
| `id` | text | Unique identifier | Auto-generated (UUID) |
| `name` | text | Client full name | Required |
| `email` | text | Client email address | Required, validated |
| `phone` | text | Client phone number | Required, formatted |
| `service` | text | Practice area selected | Options: family, bankruptcy, estate, injury, traffic, criminal, other |
| `message` | text | Client message | Required |
| `status` | text | Submission status | Options: new, contacted, closed |

**System Fields (Auto-generated):**
- `gs_project_id` - Project identifier
- `gs_table_name` - Table name (contact_submissions)
- `created_at` - Timestamp when record was created (milliseconds)
- `updated_at` - Timestamp when record was last updated (milliseconds)
- `deleted` - Soft delete flag (boolean)

---

### **2. testimonials**

Stores client testimonials and reviews.

| Field Name | Type | Description | Options/Constraints |
|------------|------|-------------|---------------------|
| `id` | text | Unique identifier | Auto-generated (UUID) |
| `client_name` | text | Client name | Required |
| `case_type` | text | Type of legal case | e.g., Family Law, Bankruptcy |
| `rating` | number | Star rating | 1-5 |
| `testimonial_text` | text | Testimonial content | Required |
| `approved` | bool | Approval status | true/false (for moderation) |

**System Fields (Auto-generated):**
- Same as contact_submissions table

---

## 🔌 **API Endpoints**

### Base URL
All endpoints use relative URLs: `tables/{table_name}`

### **Contact Submissions API**

#### **1. List All Submissions**
```
GET tables/contact_submissions?page=1&limit=50
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Records per page (default: 100, max: 100)
- `search` (optional) - Search query
- `sort` (optional) - Sort by field name

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "(440) 123-4567",
      "service": "family",
      "message": "Need help with custody case",
      "status": "new",
      "created_at": 1706745600000,
      "updated_at": 1706745600000
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50,
  "table": "contact_submissions"
}
```

#### **2. Get Single Submission**
```
GET tables/contact_submissions/{id}
```

**Response:** Single record object

#### **3. Create Submission**
```
POST tables/contact_submissions
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(440) 987-6543",
  "service": "bankruptcy",
  "message": "Need consultation about Chapter 7",
  "status": "new"
}
```

**Response:** Created record with system fields (HTTP 201)

#### **4. Update Submission Status**
```
PATCH tables/contact_submissions/{id}
Content-Type: application/json

{
  "status": "contacted"
}
```

**Response:** Updated record object

#### **5. Delete Submission**
```
DELETE tables/contact_submissions/{id}
```

**Response:** No content (HTTP 204)  
**Note:** This is a soft delete (sets `deleted=true`)

---

### **Testimonials API**

#### **1. List Approved Testimonials**
```
GET tables/testimonials?page=1&limit=10
```

Filter for approved only in your application code.

#### **2. Create Testimonial**
```
POST tables/testimonials
Content-Type: application/json

{
  "client_name": "Sarah M.",
  "case_type": "Family Law Client",
  "rating": 5,
  "testimonial_text": "Jared was incredibly professional...",
  "approved": false
}
```

#### **3. Approve Testimonial**
```
PATCH tables/testimonials/{id}
Content-Type: application/json

{
  "approved": true
}
```

---

## 💻 **JavaScript Implementation**

### **Current Implementation**

The contact form now uses the RESTful API:

```javascript
// Submit form to API
fetch('tables/contact_submissions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    console.log('Submission saved:', data);
    // Show success message
})
.catch(error => {
    console.error('Error:', error);
    // Show error message
});
```

### **Example: Load Testimonials Dynamically**

You can fetch and display testimonials from the database:

```javascript
// Load testimonials from API
async function loadTestimonials() {
    try {
        const response = await fetch('tables/testimonials?limit=3');
        const result = await response.json();
        
        // Filter for approved testimonials
        const approved = result.data.filter(t => t.approved === true);
        
        // Display testimonials
        displayTestimonials(approved);
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}
```

### **Example: View All Submissions (Admin)**

```javascript
// Fetch all contact submissions
async function loadSubmissions() {
    try {
        const response = await fetch('tables/contact_submissions?sort=-created_at');
        const result = await response.json();
        
        console.log(`Total submissions: ${result.total}`);
        console.log('Recent submissions:', result.data);
        
        return result.data;
    } catch (error) {
        console.error('Error loading submissions:', error);
    }
}
```

---

## 🔐 **Data Management**

### **Viewing Stored Data**

To view submissions stored in the database:

1. Open browser console (F12)
2. Run:
```javascript
fetch('tables/contact_submissions')
    .then(r => r.json())
    .then(data => console.table(data.data));
```

### **Updating Submission Status**

```javascript
// Mark submission as contacted
async function updateStatus(submissionId) {
    const response = await fetch(`tables/contact_submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' })
    });
    return response.json();
}
```

---

## 📝 **Notes**

1. **No Server Required**: The RESTful Table API is built-in and requires no backend setup
2. **Automatic Timestamps**: `created_at` and `updated_at` are managed automatically
3. **Soft Deletes**: Deleted records are flagged, not permanently removed
4. **Pagination**: Use `page` and `limit` parameters for large datasets
5. **Search**: Use `search` parameter to filter results
6. **Sorting**: Use `sort` parameter (prefix with `-` for descending order)

---

## 🚀 **What This Means for You**

✅ **Contact form submissions are now saved to a real database**  
✅ **Data persists across page reloads and browser sessions**  
✅ **You can access all submissions via the API**  
✅ **Ready for production use**  
✅ **No additional setup required**

---

## 📊 **Future Enhancements**

Potential additions to the database schema:

- `appointments` - Schedule and manage client appointments
- `cases` - Track ongoing legal cases
- `documents` - Store document metadata
- `invoices` - Billing and payment records
- `notes` - Internal notes about clients/cases

---

**The database is now fully configured and integrated with your contact form!** 🎉