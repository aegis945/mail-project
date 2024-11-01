# Email Application

This project is a fully functional email application built with Django, providing a user-friendly interface for managing emails as a **Single Page Application (SPA)**. It includes inbox navigation, viewing email content, and email archiving.

## Features

1. **Inbox Management**: Users can view their inbox, with emails displayed in a structured format similar to popular email services.
  
2. **View Email Content**: Each email displays essential details such as sender, recipients, subject, timestamp, and email body.

3. **Email Actions**: Users can mark emails as read or unread, archive and unarchive emails, and delete emails.

4. **JavaScript Functionality**: Enhanced user experience through JavaScript handling for navigating between inbox and email details without page reloads.

## Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/aegis945/mail-project
cd email-project
cd e-commerce
```
2. **Create a Virtual Environment**
```bash
python -m venv venv
```
3. **Activate the Virtual Environment**:
   
  - On macOS/Linux:
```bash
source venv/bin/activate
```
  - On Windows: 
```bash
venv\Scripts\activate
```
4. **Install dependencies**:
```bash
pip install -r requirements.txt
```
5. **Set Up Environment Variables: Create a .env file in the project root directory and define your environment variables**:
```bash
SECRET_KEY=your_secret_key
DEBUG=True
```
6. **Run Migrations:**
```bash
python manage.py migrate
```
7. **Run dev server:**
```bash
python manage.py runserver
```
8. **Open your web browser and go to http://127.0.0.1:8000**
