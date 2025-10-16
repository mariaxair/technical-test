# 📧 Bulk Email Sender Application

A **full-stack bulk email sending system** built with **Node.js (Express)**, **Angular**, **MySQL**, and **Flutter (WebView)**.  
Designed to manage email templates, recipients, and automate mass sending with validation and history tracking.

---

## 🚀 Features

- 🧩 **Template Management** — Create & edit email templates with dynamic variables (`{{name}}`, `{{email}}`, etc.)
- 👥 **Recipient Management** — Add recipients manually or import from CSV
- ✅ **Email Validation** — Automatic email validation
- 📤 **Bulk Sending** — Send emails in bulk using secure SMTP
- 📊 **History & Analytics** — View history of sent emails and performance statistics
- 📱 **Mobile App** — Flutter application wrapping the Angular frontend (WebView)

---

## 🏗️ Technologies

| Layer        | Stack                     |
| :----------- | :------------------------ |
| **Backend**  | Node.js + Express         |
| **Frontend** | Angular                   |
| **Database** | MySQL                     |
| **Mobile**   | Flutter (WebView)         |
| **SMTP**     | Gmail (with App Password) |

---

## 🗂️ Project Structure

```
technical_test/
├── backend/
|   │── src/
│   │   ├── Controllers/
│   │   │   ├── emailController.js
│   │   │   ├── historyController.js
│   │   │   ├── recipientController.js
│   │   │   └── templateController.js
│   │   ├── DB/
│   │   │   ├── bulk_email_db.sql
│   │   ├── Models/
│   │   │   ├── emailModel.js
│   │   │   ├── historyModel.js
│   │   │   ├── recipientModel.js
│   │   │   └── templateModel.js
│   │   ├── Routes/
│   │   │   ├── emailRoutes.js
│   │   │   ├── historyRoutes.js
│   │   │   ├── recipientRoutes.js
│   │   │   └── templateRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── history/
│       │   │   ├── history.component.css
│       │   │   ├── history.component.html
│       │   │   └── history.component.ts
│       │   ├── recipients/
│       │   │   ├── recipient.component.css
│       │   │   ├── recipient.component.html
│       │   │   └── recipient.component.ts
│       │   ├── send-email/
│       │   │   ├── send-email.component.css
│       │   │   ├── send-email.component.html
│       │   │   └── send-email.component.ts
│       │   ├── services/
│       │   │   └── api.service.ts
│       │   ├── templates/
│       │   │   ├── template.component.css
│       │   │   ├── template.component.html
│       │   │   └── template.component.ts
│       │   ├── app.component.css
│       │   ├── app.component.html
│       │   └── app.component.ts
│       │── index.html
│       │── main.ts
│       └── style.css
│── mobile/
│   │── lib/
│   │   └── main.dart
│   └──pubspec.yaml
│── emails.csv
└── README.md
```

---

## ⚙️ Setup Instructions

### 🖥️ Backend (Node.js)

#### 1️⃣ Install dependencies

```bash
cd backend
npm install
```

#### 2️⃣ Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bulk_email_db

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
KICKBOX_API_KEY=your_api_password
```

**⚠️ Important for Gmail SMTP:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password (16 characters) **without spaces**

**⚠️ Important for KICKBOX API key:**

1. Create an account on https://docs.kickbox.com/docs/using-the-api
2. Go to Dashboard > API > Manage Keys > create your app key
3. Use the generated password (live\_**\*\*\*\***\***\*\*\*\***)

#### 3️⃣ Setup MySQL database

Make sure MySQL is running, then execute:

```bash
mysql -u root -p < src/DB/bulk_email_db.sql
```

Or manually:

```sql
mysql -u root -p
password:
CREATE DATABASE bulk_email_db;
USE bulk_email_db;
>mysql-- Then copy/paste the content of schema.sql
```

#### 4️⃣ Start the backend server

```bash
npm start
```

Backend will run at: **http://localhost:3000**

You should see:

```
Server is running on port 3000
✅ SMTP connection verified successfully
```

---

### 🌐 Frontend (Angular)

#### 1️⃣ Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli
```

#### 2️⃣ Install dependencies

```bash
cd frontend
npm install
```

#### 3️⃣ Configure API URL

**Option A: For web browser access**

Keep default in `src/app/services/api.service.ts`:

```typescript
private baseUrl = 'http://localhost:3000/api';
```

**Option B: For mobile device access**

Create `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://YOUR_LOCAL_IP:3000/api", // e.g., http://192.168.1.10:3000/api
};
```

And update `api.service.ts`:

```typescript
import { environment } from '../environments/environment';

private baseUrl = environment.apiUrl;
```

#### 4️⃣ Run the Angular app

```bash
ng serve
```

Or for mobile access:

```bash
ng serve --host 0.0.0.0
```

Frontend will be accessible at: **http://localhost:4200**

---

### 📱 Mobile (Flutter WebView)

#### 1️⃣ Install Flutter SDK

Follow the official installation guide:  
🔗 https://flutter.dev/docs/get-started/install

**Required installations:**

- Flutter SDK
- Android Studio
- Android SDK Platform Tools
- Android SDK Command-line Tools

Verify installation:

```bash
flutter doctor
```

#### 2️⃣ Configure Android SDK

1. Open **Android Studio** → `More Actions` → `SDK Manager`
2. Install:
   - Android SDK Platform 34+
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
3. Accept all licenses:
   ```bash
   flutter doctor --android-licenses
   ```

#### 3️⃣ Configure permissions

Edit `mobile/android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Add these permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="Bulk Email Sender"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
        <!-- Rest of the application config -->
    </application>
</manifest>
```

#### 4️⃣ Configure the WebView URL

Edit `mobile/lib/main.dart`:

**For Android Emulator:**

```dart
..loadRequest(Uri.parse('http://10.0.2.2:4200'));
```

**For Physical Device (same WiFi network):**

```dart
..loadRequest(Uri.parse('http://YOUR_LOCAL_IP:4200'));
```

Find your local IP:

- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr`

#### 5️⃣ Install dependencies

```bash
cd mobile
flutter pub get
```

#### 6️⃣ Run the app

**On Emulator:**

```bash
flutter run
```

**On Physical Device:**

1. Enable Developer Mode on your phone:
   - Go to Settings → About Phone
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect phone via USB
4. Run:
   ```bash
   flutter devices
   flutter run
   ```

---

## 📦 Building APK for Android

To generate a release APK:

```bash
cd mobile
flutter build apk --release
```

Your APK will be located at:

```
mobile/build/app/outputs/flutter-apk/app-release.apk
```

Transfer this file to your Android device and install it.

---

## 🧠 Database Schema

### **templates**

| Column     | Type     | Description             |
| :--------- | :------- | :---------------------- |
| id         | INT      | Primary key (auto)      |
| name       | VARCHAR  | Template name           |
| subject    | VARCHAR  | Email subject           |
| body       | TEXT     | HTML email body         |
| variables  | JSON     | Dynamic variables array |
| created_at | DATETIME | Creation timestamp      |
| updated_at | DATETIME | Last update timestamp   |

### **recipients**

| Column     | Type     | Description             |
| :--------- | :------- | :---------------------- |
| id         | INT      | Primary key (auto)      |
| email      | VARCHAR  | Email address (unique)  |
| name       | VARCHAR  | Recipient name          |
| metadata   | JSON     | Custom data object      |
| is_valid   | BOOLEAN  | Email validation status |
| created_at | DATETIME | Creation timestamp      |
| updated_at | DATETIME | Last update timestamp   |

### **email_history**

| Column        | Type                  | Description        |
| :------------ | :-------------------- | :----------------- |
| id            | INT                   | Primary key (auto) |
| template_id   | INT                   | FK → templates     |
| recipient_id  | INT                   | FK → recipients    |
| status        | ENUM('sent','failed') | Send status        |
| error_message | TEXT                  | Error details      |
| sent_at       | DATETIME              | Sending timestamp  |

---

## 🔌 API Endpoints

### 📑 Templates

| Method | Endpoint             | Description         |
| :----- | :------------------- | :------------------ |
| GET    | `/api/templates`     | Get all templates   |
| GET    | `/api/templates/:id` | Get template by ID  |
| POST   | `/api/templates`     | Create new template |
| PUT    | `/api/templates/:id` | Update template     |
| DELETE | `/api/templates/:id` | Delete template     |

### 👥 Recipients

| Method | Endpoint                 | Description            |
| :----- | :----------------------- | :--------------------- |
| GET    | `/api/recipients`        | Get all recipients     |
| GET    | `/api/recipients/valid`  | Get valid recipients   |
| GET    | `/api/recipients/:id`    | Get recipient by ID    |
| POST   | `/api/recipients`        | Add recipient manually |
| POST   | `/api/recipients/import` | Import from CSV        |
| PUT    | `/api/recipients/:id`    | Update recipient       |
| DELETE | `/api/recipients/:id`    | Delete recipient       |

### 📤 Emails

| Method | Endpoint                | Description      |
| :----- | :---------------------- | :--------------- |
| POST   | `/api/emails/send-bulk` | Send bulk emails |
| POST   | `/api/emails/test`      | Send test email  |

### 📊 History

| Method | Endpoint                    | Description             |
| :----- | :-------------------------- | :---------------------- |
| GET    | `/api/history`              | Get email history       |
| GET    | `/api/history/template/:id` | History by template     |
| GET    | `/api/history/stats`        | Get statistics          |
| GET    | `/api/history/:id`          | Get history entry by ID |

---

## 📝 Usage Guide

### 1. Create Email Templates

1. Navigate to **Templates** section
2. Click **+ New Template**
3. Fill in:
   - Template name
   - Email subject
   - Email body (HTML supported)
4. Use variables like `{{name}}`, `{{email}}`, `{{company}}` for personalization
5. Save the template

### 2. Add Recipients

**Manual Addition:**

1. Go to **Recipients** section
2. Click **+ Add Recipient**
3. Enter email and name
4. Save

**CSV Import:**

1. Prepare CSV file with format:
   ```csv
   email,name,company,position
   john@example.com,John Doe,ABC Corp,Manager
   jane@example.com,Jane Smith,XYZ Ltd,Developer
   ```
2. Click **Import CSV**
3. Select your file
4. Recipients will be imported and validated

### 3. Send Bulk Emails

1. Navigate to **Send Emails** section
2. Select a template
3. (Optional) Send test email to verify
4. Select recipients (or select all)
5. Click **Send Bulk Emails**
6. Confirm and wait for completion

### 4. View History

1. Go to **History** section
2. View statistics (sent, failed, success rate)
3. Browse detailed history of all sent emails
4. Check error messages for failed emails

---

## 🧩 Troubleshooting

### ❌ Backend Issues

**Database connection failed:**

```bash
# Check MySQL is running
# Windows:
services.msc (look for MySQL)

# Verify credentials in .env
DB_USER=root
DB_PASSWORD=your_actual_password
```

**SMTP authentication error:**

```bash
# Common error: "Invalid login: 535-5.7.8 Username and Password not accepted"
# Solution:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password WITHOUT SPACES in .env
```

### ❌ Frontend Issues

**CORS errors:**

```bash
# Backend already includes cors middleware
# If issues persist, explicitly allow your frontend origin in server.js:

app.use(cors({
  origin: 'http://localhost:4200'
}));
```

**API calls failing:**

```bash
# Check backend is running on http://localhost:3000
# Test API directly: http://localhost:3000/api/templates
```

### ❌ Mobile Issues

**WebView not loading:**

```bash
# For Emulator: Use http://10.0.2.2:4200
# For Physical Device: Use http://YOUR_LOCAL_IP:4200

# Find your IP:
# Windows: ipconfig
# Mac/Linux: ifconfig
```

**Build failed:**

```bash
# Clear Flutter cache
flutter clean
flutter pub get
flutter build apk
```

**Connection refused:**

```bash
# Ensure:
1. Backend is running
2. Frontend is running with: ng serve --host 0.0.0.0
3. Firewall allows connections on ports 3000 and 4200
4. Phone and PC are on SAME WiFi network
```

### ❌ Email Sending Issues

**All emails marked as failed:**

```bash
# Check backend console logs for specific error
# Common issues:
1. Invalid SMTP credentials
2. Gmail blocking "less secure apps" (use App Password)
3. Network firewall blocking SMTP port 587
4. Daily sending limit reached (Gmail: 500/day)
```

**Metadata parsing error:**

```bash
# Fix database entries with invalid metadata:
UPDATE recipients SET metadata = '{}' WHERE metadata = '[object Object]';
```

---

## 💡 Tips & Best Practices

### Performance Optimization

- Import recipients in batches (max 1000 at a time)
- Use email validation to avoid bounces
- Implement rate limiting for bulk sends

### Email Deliverability

- Use clear, descriptive subject lines
- Test templates before bulk sending
- Include unsubscribe links (for production)
- Monitor spam scores

### Security

- Never commit `.env` file
- Use strong database passwords
- Implement authentication in production
- Sanitize user inputs

### Development

```bash
# Update all dependencies
npm update                    # Backend & Frontend
flutter pub upgrade          # Mobile

# Clear caches
ng cache clean               # Angular
flutter clean                # Flutter
rm -rf node_modules          # Node.js
```

---

## 📚 Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs
- **Angular Documentation:** https://angular.io/docs
- **Flutter Documentation:** https://flutter.dev/docs
- **Nodemailer Guide:** https://nodemailer.com/about/
- **MySQL Reference:** https://dev.mysql.com/doc/

---

## 📄 License

MIT License - Feel free to use this project for educational or commercial purposes.

---

## 👨‍💻 Author

Built with ❤️ for a technical assessment  
Using Node.js, Angular, MySQL & Flutter

---

## 🙏 Acknowledgments

- Nodemailer for SMTP integration
- Angular team for the framework
- Flutter team for mobile development tools
- MySQL community for database support

---

**Happy Emailing! 📧**
