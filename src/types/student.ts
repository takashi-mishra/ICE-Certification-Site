export interface Student {
  id: string;
  studentName: string;
  email: string;
  mobileNumber: string;
  address: string;
  batchNumber: string;
  courseName: string;
  courseStartDate: string;
  courseEndDate: string;
  certificateIssueDate: string;
  certificateUrl?: string;
  isValid: boolean;
  createdAt: string;
}

export interface ExcelRow {
  'Student Name': string;
  'Email': string;
  'Mobile Number': string;
  'Address': string;
  'Batch Number': string;
  'Course Name': string;
  'Course Start Date': string;
  'Course End Date': string;
  'Certificate Issue Date': string;
}

export interface VerificationResult {
  found: boolean;
  student?: Student;
  message: string;
}
