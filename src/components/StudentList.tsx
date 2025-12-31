import { useState, useEffect } from "react";
import { Eye, Download, Trash2, QrCode, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getStudents, deleteStudent, deleteAllStudents } from "@/lib/studentStorage";
import { generateQRCode } from "@/lib/qrGenerator";
import CertificatePreview from "./CertificatePreview";
import type { Student } from "@/types/student";

interface StudentWithQR extends Student {
  qrCode?: string;
}

const StudentList = () => {
  const [students, setStudents] = useState<StudentWithQR[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithQR | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const loadStudents = async () => {
    const storedStudents = getStudents();
    
    // Generate QR codes for all students (embed student data so QR verification works on other devices)
    // Use a moderate size for list thumbnails to save time; the preview/download will use a high-res QR.
    const studentsWithQR = await Promise.all(
      storedStudents.map(async (student) => ({
        ...student,
        qrCode: await generateQRCode(student, 200),
      }))
    );
    
    setStudents(studentsWithQR);
  };

  useEffect(() => {
    loadStudents();
    
    // Listen for storage changes
    const handleStorageChange = () => loadStudents();
    window.addEventListener("studentsUpdated", handleStorageChange);
    return () => window.removeEventListener("studentsUpdated", handleStorageChange);
  }, []);

  const handlePreview = (student: StudentWithQR) => {
    setSelectedStudent(student);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    loadStudents();
    toast({
      title: "Certificate Deleted",
      description: "The certificate has been removed successfully.",
    });
  };

  const handleDeleteAll = () => {
    deleteAllStudents();
    setStudents([]);
    toast({
      title: "All Certificates Deleted",
      description: "All certificates have been removed.",
    });
  };

  const handleDownload = async (student: StudentWithQR) => {
    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Regenerate a high-resolution QR for the printable certificate so scanning the PDF works reliably
    const printQr = await generateQRCode(student, 600);

    // Embed student data in the printed verify link as fragment so servers won't see the long payload
    const verifyLink = `${window.location.origin}/verify/${student.id}#data=${encodeURIComponent(btoa(JSON.stringify(student)))}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${student.studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; background: #fff; padding: 40px; }
            .certificate {
              max-width: 800px;
              margin: 0 auto;
              border: 8px double #1a365d;
              padding: 40px;
              background: linear-gradient(135deg, #fefce8 0%, #fff 50%, #fefce8 100%);
              /* Avoid breaking the certificate across pages when printing */
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .header { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; background: #1a365d; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px; font-weight: bold; }
            .org-name h2 { color: #1a365d; font-size: 28px; }
            .org-name p { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
            .title { text-align: center; margin: 30px 0; }
            .title h1 { color: #1a365d; font-size: 42px; text-transform: uppercase; letter-spacing: 4px; }
            .title p { color: #666; font-size: 16px; text-transform: uppercase; letter-spacing: 3px; margin-top: 8px; }
            .content { text-align: center; margin: 30px 0; }
            .certify-text { color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
            .student-name { color: #1a365d; font-size: 36px; margin-bottom: 20px; }
            .description { color: #444; line-height: 1.8; max-width: 600px; margin: 0 auto; }
            .details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
            .detail-item { text-align: left; }
            .detail-item span { color: #666; font-size: 12px; }
            .detail-item p { color: #1a365d; font-weight: 600; margin-top: 4px; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 30px; border-top: 1px solid #ddd; }
            .signature { text-align: center; }
            .signature-line { border-bottom: 2px solid #1a365d; padding-bottom: 8px; font-style: italic; color: #1a365d; }
            .signature p { margin-top: 8px; }
            .signature .name { font-weight: 600; color: #1a365d; }
            .signature .title { color: #666; font-size: 12px; }
            .qr-section { text-align: center; }
            .qr-section img { width: 120px; height: 120px; }
            .qr-section p { font-size: 10px; color: #666; margin-top: 8px; }
            .verify-url { text-align: center; margin-top: 20px; font-size: 11px; color: #888; }
            @media print {
              body { padding: 0; }
              .certificate { border-width: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="logo">ICES</div>
              <div class="org-name">
                <h2>ICES</h2>
                <p>Institute of Continuing Education</p>
              </div>
            </div>
            
            <div class="title">
              <h1>Certificate</h1>
              <p>of Course Completion</p>
            </div>
            
            <div class="content">
              <p class="certify-text">This is to certify that</p>
              <h2 class="student-name">${student.studentName}</h2>
              <p class="description">
                has successfully completed an intensive <strong>${student.courseName}</strong> 
                program conducted from <strong>${new Date(student.courseStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> 
                to <strong>${new Date(student.courseEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
                <br><br>
                We acknowledge the dedication, discipline, and performance demonstrated throughout the course.
              </p>
            </div>
            
            <div class="details">
              <div class="detail-item">
                <span>Batch Number</span>
                <p>${student.batchNumber}</p>
              </div>
              <div class="detail-item">
                <span>Issue Date</span>
                <p>${new Date(student.certificateIssueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div class="detail-item">
                <span>Certificate ID</span>
                <p>${student.id}</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="signature">
                <p class="signature-line">Authorized Signature</p>
                <p class="name">Dr. Director Name</p>
                <p class="title">Director, ICES</p>
              </div>
              <div class="qr-section">
                <img src="${printQr}" alt="QR Code" style="width:120px;height:120px;" />
                <p>Scan to verify</p>
              </div>
            </div>
            
            <p class="verify-url">Verify at: ${window.location.origin}/verify/${student.id}</p>
            <p class="verify-url" style="font-size:11px; color:#888; margin-top:6px;">Scan the QR to verify or visit: ${window.location.origin}/verify/${student.id}</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (students.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Generated Certificates ({students.length})</CardTitle>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all certificates?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {students.length} certificates. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {student.qrCode && (
                      <img
                        src={student.qrCode}
                        alt="QR Code"
                        className="h-16 w-16 rounded-lg border border-border"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {student.studentName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.courseName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {student.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(student)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(student)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete certificate?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the certificate for {student.studentName}. 
                            The verification link will no longer work.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(student.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="mt-4">
              <CertificatePreview student={selectedStudent} qrCode={selectedStudent.qrCode} />
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(selectedStudent)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default StudentList;
