// Mock data for testing the React Native app UI
// This file contains sample data that simulates API responses

export const mockUserProfile = {
  parentId: "PARENT001",
  name: "John Smith",
  students: [
    {
      studentId: "STUDENT001",
      name: "Alice Smith",
      class: "Grade 5"
    }
  ]
};

export const mockStudentInfo = {
  studentId: "STUDENT001",
  name: "Alice Smith",
  class: "Grade 5",
  dob: "2010-05-15",
  gender: "Female",
  bloodGroup: "O+",
  address: "123 Main Street, Anytown, USA",
  phone: "+1 (555) 123-4567",
  email: "alice.smith@student.school.edu",
  fatherName: "John Smith",
  motherName: "Jane Smith",
  parentPhone: "+1 (555) 987-6543"
};

export const mockAttendanceRecords = [
  { date: "2025-08-20", status: "Present", remarks: "" },
  { date: "2025-08-19", status: "Absent", remarks: "Sick leave" },
  { date: "2025-08-18", status: "Present", remarks: "" },
  { date: "2025-08-17", status: "Present", remarks: "" },
  { date: "2025-08-16", status: "Absent", remarks: "Family event" },
  { date: "2025-08-15", status: "Present", remarks: "" },
  { date: "2025-08-14", status: "Present", remarks: "" },
  { date: "2025-08-13", status: "Absent", remarks: "Doctor appointment" },
  { date: "2025-08-12", status: "Present", remarks: "" },
  { date: "2025-08-11", status: "Present", remarks: "" }
];

export const mockAcademicRecords = [
  {
    subject: "Mathematics",
    grade: "A",
    classWork: "Excellent",
    homeWork: "Good",
    testScore: 85,
    examScore: 92,
    totalScore: 88,
    remarks: "Consistent performance"
  },
  {
    subject: "English",
    grade: "B+",
    classWork: "Good",
    homeWork: "Excellent",
    testScore: 78,
    examScore: 85,
    totalScore: 81,
    remarks: "Strong writing skills"
  },
  {
    subject: "Science",
    grade: "A-",
    classWork: "Very Good",
    homeWork: "Good",
    testScore: 90,
    examScore: 88,
    totalScore: 89,
    remarks: "Excellent lab work"
  },
  {
    subject: "History",
    grade: "B",
    classWork: "Good",
    homeWork: "Satisfactory",
    testScore: 75,
    examScore: 80,
    totalScore: 77,
    remarks: "Needs improvement in dates"
  }
];

export const mockAnnouncements = [
  {
    title: "School Closed on Monday",
    date: "2025-08-20T00:00:00Z",
    content: "The school will be closed on Monday, August 25th, 2025 for maintenance work. All classes will be rescheduled to Tuesday.",
    author: "Principal Johnson"
  },
  {
    title: "Annual Sports Day",
    date: "2025-08-15T00:00:00Z",
    content: "Our annual sports day is scheduled for September 5th, 2025. Please ensure all students wear their sports uniforms and bring water bottles.",
    author: "Sports Coordinator"
  },
  {
    title: "Parent-Teacher Meeting",
    date: "2025-08-10T00:00:00Z",
    content: "Parent-teacher meetings will be held on August 22nd, 2025 from 3:00 PM to 6:00 PM. Please book your slot through the school management portal.",
    author: "Academic Head"
  }
];

export const mockTimetable = [
  {
    day: "Monday",
    subject: "Mathematics",
    time: "9:00 AM - 10:00 AM",
    teacher: "Mr. Anderson",
    room: "Room 101"
  },
  {
    day: "Monday",
    subject: "English",
    time: "10:15 AM - 11:15 AM",
    teacher: "Mrs. Thompson",
    room: "Room 205"
  },
  {
    day: "Monday",
    subject: "Science",
    time: "11:30 AM - 12:30 PM",
    teacher: "Dr. Martinez",
    room: "Lab 301"
  },
  {
    day: "Tuesday",
    subject: "History",
    time: "9:00 AM - 10:00 AM",
    teacher: "Mr. Wilson",
    room: "Room 105"
  },
  {
    day: "Tuesday",
    subject: "Geography",
    time: "10:15 AM - 11:15 AM",
    teacher: "Ms. Davis",
    room: "Room 201"
  },
  {
    day: "Wednesday",
    subject: "Mathematics",
    time: "9:00 AM - 10:00 AM",
    teacher: "Mr. Anderson",
    room: "Room 101"
  },
  {
    day: "Wednesday",
    subject: "Art",
    time: "10:15 AM - 11:15 AM",
    teacher: "Ms. Garcia",
    room: "Art Room"
  },
  {
    day: "Thursday",
    subject: "English",
    time: "9:00 AM - 10:00 AM",
    teacher: "Mrs. Thompson",
    room: "Room 205"
  },
  {
    day: "Thursday",
    subject: "Science",
    time: "10:15 AM - 11:15 AM",
    teacher: "Dr. Martinez",
    room: "Lab 301"
  },
  {
    day: "Friday",
    subject: "Physical Education",
    time: "9:00 AM - 10:00 AM",
    teacher: "Coach Brown",
    room: "Gymnasium"
  }
];