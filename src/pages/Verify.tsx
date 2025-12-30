import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificatePreview from "@/components/CertificatePreview";
import { CheckCircle2, XCircle, Award, Calendar, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Student } from "@/types/student";

// Mock data for demonstration - in production, this would come from the database
const mockStudents: Record<string, Student> = {
  "ICES-2024-001": {
    id: "ICES-2024-001",
    studentName: "Sakshi Raghav",
    email: "sakshi.raghav@email.com",
    mobileNumber: "+91 98765 43210",
    address: "New Delhi, India",
    batchNumber: "BATCH-2024-Q1",
    courseName: "Java Programming Certification",
    courseStartDate: "2024-01-15",
    courseEndDate: "2024-03-15",
    certificateIssueDate: "2024-03-20",
    isValid: true,
    createdAt: "2024-03-20T10:00:00Z",
  },
  "ICES-2024-002": {
    id: "ICES-2024-002",
    studentName: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    mobileNumber: "+91 98765 43211",
    address: "Mumbai, India",
    batchNumber: "BATCH-2024-Q1",
    courseName: "Web Development Bootcamp",
    courseStartDate: "2024-02-01",
    courseEndDate: "2024-04-01",
    certificateIssueDate: "2024-04-05",
    isValid: true,
    createdAt: "2024-04-05T10:00:00Z",
  },
};

const Verify = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const student = studentId ? mockStudents[studentId] : undefined;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!student) {
    return (
      <>
        <Helmet>
          <title>Certificate Not Found - ICES</title>
          <meta name="description" content="The certificate you're looking for could not be found or is invalid." />
        </Helmet>

        <div className="flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex flex-1 items-center justify-center py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-md text-center">
                <div className="mb-6 inline-flex rounded-full bg-destructive/10 p-4">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-foreground">
                  Certificate Not Found
                </h1>
                <p className="mb-6 text-muted-foreground">
                  The certificate you're looking for could not be found or may be invalid. 
                  Please check the QR code or certificate ID and try again.
                </p>
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                  <p className="text-sm font-medium text-destructive">
                    ❌ This certificate is NOT verified
                  </p>
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Verified Certificate - {student.studentName} | ICES</title>
        <meta 
          name="description" 
          content={`Verified certificate for ${student.studentName} - ${student.courseName} from ICES.`} 
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Banner */}
          <section className="gradient-hero py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/20 px-4 py-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">VERIFIED CERTIFICATE</span>
                </div>
                <h1 className="mb-2 text-3xl font-bold text-primary-foreground lg:text-4xl">
                  {student.studentName}
                </h1>
                <p className="text-lg text-primary-foreground/80">
                  {student.courseName}
                </p>
              </div>
            </div>
          </section>

          {/* Verification Details */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                {/* Status Banner */}
                <div className="mb-8 rounded-xl bg-success/10 border border-success/30 p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-success animate-pulse-glow" />
                    <div>
                      <p className="text-lg font-semibold text-success">
                        Certificate Status: VALID ✅
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This certificate has been verified and is authentic
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: BookOpen, label: "Course", value: student.courseName },
                    { icon: Users, label: "Batch", value: student.batchNumber },
                    { icon: Calendar, label: "Duration", value: `${formatDate(student.courseStartDate)} - ${formatDate(student.courseEndDate)}` },
                    { icon: Award, label: "Issued", value: formatDate(student.certificateIssueDate) },
                  ].map((item, index) => (
                    <Card key={index} className="shadow-soft">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="truncate text-sm font-medium text-foreground">{item.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Certificate Preview */}
                <div className="rounded-xl bg-muted/30 p-6 lg:p-8">
                  <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
                    Certificate Preview
                  </h2>
                  <CertificatePreview student={student} />
                </div>

                {/* Organization Info */}
                <div className="mt-8 flex items-center justify-center gap-4 rounded-xl bg-card p-6 shadow-soft">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
                    <Award className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      ICES - Institute of Continuing Education
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Certified learning partner with IIT Ropar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Verify;
