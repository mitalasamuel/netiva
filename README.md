# School Management App - READ ONLY

A React Native application that **ONLY READS** from your existing school management MongoDB database. This app does NOT create, update, or delete any data - it simply displays existing student information.

## ⚠️ **READ-ONLY APP**

This app is designed to:
- ✅ **READ** existing student data from your MongoDB database
- ✅ **DISPLAY** student information, attendance, exam results, and notices
- ✅ **AUTHENTICATE** with existing student IDs
- ❌ **NOT CREATE** any new data
- ❌ **NOT UPDATE** any existing data
- ❌ **NOT DELETE** any data

## Features

- **Student Authentication**: Login with existing student IDs
- **Student Information**: View personal details, guardian info, contact details
- **Attendance Records**: View existing attendance history
- **Exam Results**: View existing exam scores and marks
- **School Notices**: View existing school announcements
- **Read-Only Interface**: No editing, creating, or deleting capabilities

## Prerequisites

- Your existing school management MongoDB database
- Node.js and React Native development environment
- The backend server running (connects to your existing database)

## Setup

1. **Start Your Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the React Native App**:
   ```bash
   npm start
   ```

3. **Login with Existing Student ID**:
   - Use any existing student ID from your database
   - The app will authenticate and display that student's information

## Usage

1. **Login**: Enter an existing student ID
2. **View Information**: Browse through the student's data
3. **Read Only**: All data is displayed but cannot be modified

## API Endpoints (Read-Only)

- `POST /api/login` - Authenticate with existing student ID
- `GET /api/student/:studentId` - Get existing student information
- `GET /api/attendance/:studentId` - Get existing attendance records
- `GET /api/exam-results/:studentId` - Get existing exam results
- `GET /api/notices` - Get existing school notices

## Database Connection

The app connects to your existing MongoDB database using:
- **MongoDB URI**: Your existing connection string
- **Collections**: Uses your existing students, notices, etc.
- **Schema**: Matches your existing data structure

## Security

- JWT token-based authentication
- Read-only access to prevent data modification
- Secure connection to your existing database

## Important Notes

- This app **preserves all your existing data**
- No new data is created or modified
- Works with your existing student IDs and data structure
- Designed to be a simple viewer for your school management system

## Support

For issues with your existing data, contact your school administrator. This app only displays what's already in your database.
# netiva
# netiva
