import type { Student } from "@/types/student";

const STORAGE_KEY = "ices_students";

export const getStudents = (): Student[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const addStudents = (newStudents: Student[]): void => {
  const existing = getStudents();
  const merged = [...existing, ...newStudents];
  saveStudents(merged);
};

export const getStudentById = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find((s) => s.id === id);
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  saveStudents(filtered);
};

export const deleteAllStudents = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const generateStudentId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ICES-${year}-${random}`;
};
