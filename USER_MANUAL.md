# SmartLearn System User Manual

Welcome to **SmartLearn**, your comprehensive school management system. This manual guides you through using the application to manage students, teachers, classes, and schedules efficiently.

## Table of Contents

1.  [Getting Started](#getting-started)
2.  [Dashboard Overview](#dashboard-overview)
3.  [Managing Students](#managing-students)
4.  [Managing Teachers](#managing-teachers)
5.  [Managing Classes](#managing-classes)
6.  [Timetable Management](#timetable-management)
7.  [Settings & Customization](#settings--customization)
8.  [Troubleshooting](#troubleshooting)

---

## 1. Getting Started

### Accessing the System
1.  Open your web browser (Chrome, Edge, Firefox, or Safari).
2.  Navigate to the deployed application URL (or `http://localhost:5173` if running locally).
3.  **Login**: Use your Admin credentials to sign in.
    *   *Note: If you are seeing this locally for the first time, ensure the backend Supabase connection is configured.*

### System Requirements
*   A modern web browser with JavaScript enabled.
*   Internet connection for database access.

---

## 2. Dashboard Overview

The **Dashboard** is your command center. It provides an at-a-glance view of the school's status:

*   **Key Metrics**: Total number of Students, Teachers, and active Classes.
*   **Recent Activity**: A feed of recent actions taken in the system.
*   **Quick Actions**: Shortcuts to add new students or teachers immediately.

**Navigation**: Use the Sidebar on the left (desktop) or the Menu button (mobile) to switch between modules.

---

## 3. Managing Students

Navigate to the **Students** tab to view the main registry.

### Viewing Students
*   The list displays all registered students with their ID, Name, Class, and Contact Info.
*   **Search**: Use the search bar at the top to filter students by Name, Email, or Class.

### Adding a Student
1.  Click the **"Add Student"** button.
2.  Fill in the required details:
    *   **Personal**: First Name, Last Name, Date of Birth.
    *   **Class**: Select the assigned class from the dropdown.
    *   **Contact**: Email and Phone Number.
    *   **Guardian**: Parent/Guardian name and contact.
3.  Click **Save**. The student will appear in the list immediately.

### Editing/Deleting
*   **Edit**: Click the "Edit" (Pencil) icon next to a student to update their details.
*   **Delete**: Click the "Delete" (Trash) icon to remove a student. *Warning: This action is permanent.*

---

## 4. Managing Teachers

Navigate to the **Teachers** tab.

### Features
*   **Teacher Directory**: View all staff members, their departments, and qualifications.
*   **Add Teacher**: Click "Add Teacher" to onboard new staff.
    *   Requires: Name, Email, Department, and Qualification.
*   **Update Info**: Keep teacher contact details and roles up to date using the Edit function.

---

## 5. Managing Classes

Navigate to the **Classes** tab.

### Class Structure
*   Classes are organized by **Name** (e.g., "10-A") and **Year Level** (e.g., "10").
*   You can see the number of students enrolled in each class.

### Creating a Class
1.  Click **"Add Class"**.
2.  Enter the **Class Name** and **Year Level**.
3.  Save to create the new section.

---

## 6. Timetable Management

Navigate to the **Timetable** tab to manage class schedules.

### Viewing Schedules
1.  **Select Class**: Choose a class from the dropdown menu (e.g., "10-A").
2.  The grid displays the weekly schedule (Monday-Friday) with time slots.
3.  **Color Codes**: Subjects are color-coded for easy identification (e.g., Math is Blue, Science is Green).

### Adding a Period (Class Session)
1.  Click **"Add Period"** (or click an empty slot in the grid).
2.  Select the **Day**, **Time**, **Subject**, and **Teacher**.
3.  Save the entry.
*   *Note: The system prevents double-booking a teacher for the same time slot.*

---

## 7. Settings & Customization

Navigate to the **Settings** tab.

### Personalization
*   **Profile**: Update your admin email and personal details.
*   **Appearance**: Toggle between **Light Mode** and **Dark Mode**. Your preference is saved automatically.
*   **Notifications**: Configure email and push alerts.

### System Maintenance
*   **Backup**: Options to export student/teacher data as CSV files.

---

## 8. Troubleshooting

| Issue | Possible Cause | Solution |
| :--- | :--- | :--- |
| **"Request Failed" Error** | Network or Database issue | Check your internet connection. Ensure Supabase credentials are correct. |
| **Data not loading** | Empty Database | Add new records using the "Add" buttons. |
| **Layout looks broken** | Mobile/Screen Size | The app is responsive. Try refreshing or rotating your device. |

*For technical support, contact the IT administration.*
