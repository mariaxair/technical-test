# Bulk Email Sender Application

A comprehensive bulk email sending system built with Node.js, Angular, MySQL, and Flutter.

## Features

- 📧 **Template Management**: Create and manage email templates with dynamic variables
- 👥 **Recipient Management**: Add recipients manually or import from CSV files
- ✅ **Email Validation**: Automatic validation of email addresses
- 📤 **Bulk Sending**: Send emails to multiple recipients at once
- 📊 **History & Analytics**: Track email sending history and statistics
- 📱 **Mobile App**: Flutter mobile application with WebView integration

## Technologies

- **Backend**: Node.js + Express
- **Frontend**: Angular
- **Database**: MySQL
- **Mobile**: Flutter (WebView)

## Project Structure

```
bulk-email-sender/
├── backend/
│   ├── controllers/
│   │   ├── templateController.js
│   │   ├── recipientController.js
│   │   ├── emailController.js
│   │   └── historyController.js
│   ├── models/
│   │   ├── templateModel.js
│   │   ├── recipientModel.js
│   │   ├── emailModel.js
│   │   └── historyModel.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── templates/
│       │   │   ├── recipients/
│       │   │   ├── send-emails/
│       │   │   └── history/
│       │   ├── services/
│       │   │   └── api.service.ts
│       │   ├── app.component.ts
│       │   └── app.module.ts
│       └── ...
└── mobile/
    └── lib/
        └── main.dart
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Configure Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bulk_email_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

3. **Setup Database**

```bash
mysql -u root -p < DB/bulk_email_db.sql
```

4. **Start the Server**

```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Install Angular CLI** (if not already installed)

```bash
npm install -g @angular/cli
```

2. **Install Dependencies**

```bash
cd frontend
npm install
```

3. **Update API URL** (if needed)
   Edit `src/app/services/api.services.ts` and update the `baseUrl`

4. **Start the Application**

```bash
ng serve
```

The frontend will run on `http://localhost:4200`

### Mobile Setup (Flutter)

1. **Install Flutter**
   Follow instructions at: https://flutter.dev/docs/get-started/install

2. **Install Dependencies**

```bash
cd mobile
flutter pub get
```

3. **Update WebView URL**
   Edit `lib/main.dart` and update the URL to point to your Angular app:

```dart
..loadRequest(Uri.parse('http://YOUR_IP:4200'));
```

4. **Run the App**

```bash
# For Android
flutter run

# For iOS
flutter run
```

## Database Schema

### Tables

#### templates

- `id` - Primary Key
- `name` - Template name
- `subject` - Email subject
- `body` - Email body (HTML)
- `variables` - JSON array of variables
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### recipients

- `id` - Primary Key
- `email` - Email address (unique)
- `name` - Recipient name
- `metadata` - JSON object for custom data
- `is_valid` - Boolean for email validation
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### email_history

- `id` - Primary Key
- `template_id` - Foreign Key
- `recipient_id` - Foreign Key
- `status` - ENUM ('sent', 'failed')
- `error_message` - Error details
- `sent_at` - Timestamp

## API Endpoints

### Templates

- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Recipients

- `GET /api/recipients` - Get all recipients
- `GET /api/recipients/valid` - Get valid recipients only
- `GET /api/recipients/:id` - Get recipient by ID
- `POST /api/recipients` - Create new recipient
- `POST /api/recipients/import` - Import recipients from CSV
- `PUT /api/recipients/:id` - Update recipient
- `DELETE /api/recipients/:id` - Delete recipient

### Emails

- `POST /api/emails/send-bulk` - Send bulk emails

### History

- `GET /api/history` - Get email history
- `GET /api/history/template/:templateId` - Get history by template
- `GET /api/history/stats` - Get statistics
- `GET /api/history/:id` - Get history entry by ID

## Usage Guide

### 1. Create Email Templates

- Navigate to "Templates" section
- Click "New Template"
- Enter template name, subject, and body (HTML supported)
- Use `{{variableName}}` for dynamic content
- Save the template

### 2. Add Recipients

- Navigate to "Recipients" section
- Add recipients manually or import from CSV
- CSV format: `email,name` (header row required)
- System automatically validates email addresses

### 3. Send Bulk Emails

- Navigate to "Send Emails" section
- Select a template
- Send test email (optional)
- Select recipients
- Click "Send Bulk Emails"

### 4. View History

- Navigate to "History" section
- View statistics and detailed send history
- Track success/failure rates

## SMTP Configuration

For Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `.env` file

## Security Notes

- Never commit `.env` file
- Use strong database passwords
- Keep SMTP credentials secure
- Implement rate limiting in production
- Add authentication/authorization for production use

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
ng serve --open
```

### Mobile Development

```bash
cd mobile
flutter run -d chrome  # For web testing
```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE bulk_email_db;`

### SMTP Issues

- Verify SMTP credentials
- Check firewall settings
- For Gmail, ensure App Password is used (not regular password)

### CORS Issues

- Backend includes CORS middleware
- Verify frontend URL matches allowed origins

### Mobile WebView Issues

- Use device IP address instead of localhost
- Ensure both devices are on same network
- Check firewall settings
