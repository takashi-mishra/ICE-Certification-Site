import * as XLSX from "xlsx";
import type { Student } from "@/types/student";
import { generateStudentId } from "./studentStorage";

interface ExcelRow {
  "Student Name"?: string;
  "Email"?: string;
  "Mobile Number"?: string;
  "Address"?: string;
  "Batch Number"?: string;
  "Course Name"?: string;
  "Course Start Date"?: string | number;
  "Course End Date"?: string | number;
  "Certificate Issue Date"?: string | number;
}

const parseExcelDate = (value: string | number | undefined): string => {
  if (!value) return new Date().toISOString().split("T")[0];
  
  if (typeof value === "number") {
    // Excel serial date
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
  }
  
  // Try parsing string date
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  
  return new Date().toISOString().split("T")[0];
};

export const parseExcelFile = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
        
        const students: Student[] = jsonData.map((row) => ({
          id: generateStudentId(),
          studentName: row["Student Name"] || "Unknown",
          email: row["Email"] || "",
          mobileNumber: String(row["Mobile Number"] || ""),
          address: row["Address"] || "",
          batchNumber: row["Batch Number"] || "",
          courseName: row["Course Name"] || "",
          courseStartDate: parseExcelDate(row["Course Start Date"]),
          courseEndDate: parseExcelDate(row["Course End Date"]),
          certificateIssueDate: parseExcelDate(row["Certificate Issue Date"]),
          isValid: true,
          createdAt: new Date().toISOString(),
        }));
        
        resolve(students);
      } catch (error) {
        reject(new Error("Failed to parse Excel file"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
};
