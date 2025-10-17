-- Create database
CREATE DATABASE IF NOT EXISTS bulk_email_db;
USE bulk_email_db;

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- nom du modele
  subject VARCHAR(500) NOT NULL, -- objet du mail
  body TEXT NOT NULL, -- contenu du main en HTML
  variables JSON, -- liste des variables pour la personnalisation
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  metadata JSON, -- des valeurs réelles supplementaires qui pourraient etre utiles pour la personnalisation
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_is_valid (is_valid)
);

-- Email history table
CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT,
  template_name VARCHAR(50),
  template_subject VARCHAR(100),
  recipient_id INT,
  recipient_name VARCHAR(50),
  recipient_email VARCHAR(255),
  status ENUM('sent', 'failed') NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL ,
  FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE SET NULL,
  INDEX idx_template_id (template_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_status (status),
  INDEX idx_sent_at (sent_at)
);




  
-- Insert sample data
INSERT INTO templates (name, subject, body, variables) VALUES
('Welcome Email', 'Welcome to Our Platform!', '<h1>Hello {{name}}!</h1><p>Welcome to our platform. We are glad to have you.</p>', '["name"]'),
('Newsletter', 'Monthly Newsletter', '<h1>Hi {{name}},</h1><p>Here is your monthly newsletter with the latest updates.</p>', '["name"]');

INSERT INTO recipients (email, name, metadata, is_valid) VALUES
('test1@example.com', 'John Doe', '{"company": "ABC Corp"}', TRUE),
('test2@example.com', 'Jane Smith', '{"company": "XYZ Ltd"}', TRUE),
('invalid-email', 'Invalid User', '{}', FALSE);

