import { Award } from "lucide-react";
import type { Student } from "@/types/student";

interface CertificatePreviewProps {
  student: Student;
  qrCode?: string;
}

const CertificatePreview = ({ student, qrCode }: CertificatePreviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="certificate-border rounded-lg bg-card p-8 shadow-elevated lg:p-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
              <Award className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">ICES</h2>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Institution of Civil Engineering Society
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-4xl font-bold uppercase tracking-wider text-primary lg:text-5xl">
            Certificate
          </h1>
          <p className="text-lg uppercase tracking-widest text-muted-foreground">
            of Course Completion
          </p>
        </div>

        {/* Certification Text */}
        <div className="mb-8 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            This is to certify that
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground lg:text-4xl">
            {student.studentName}
          </h2>
          <div className="mx-auto max-w-2xl space-y-4 text-muted-foreground">
            <p>
              has successfully completed an intensive{' '}
              <span className="font-semibold text-foreground">{student.courseName}</span>{' '}
              program conducted from{' '}
              <span className="font-semibold text-foreground">
                {formatDate(student.courseStartDate)}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">
                {formatDate(student.courseEndDate)}
              </span>.
            </p>
            <p>
              We acknowledge the dedication, discipline, and performance demonstrated 
              throughout the course. This certificate is awarded in recognition of 
              their successful completion of all course requirements.
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-8 grid gap-4 rounded-lg bg-muted/50 p-6 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Batch Number:</span>
            <span className="ml-2 font-medium text-foreground">{student.batchNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Issue Date:</span>
            <span className="ml-2 font-medium text-foreground">
              {formatDate(student.certificateIssueDate)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Certificate ID:</span>
            <span className="ml-2 font-mono font-medium text-foreground">{student.id}</span>
          </div>
        </div>

        {/* Footer with Signature and QR */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-border pt-8 sm:flex-row">
          {/* Signature */}
          <div className="text-center">
            <div className="mb-2 h-12 border-b-2 border-foreground">
              <p className="font-serif text-lg italic text-foreground">Authorized Signature</p>
            </div>
            <p className="text-sm font-semibold text-foreground">Dr. Director Name</p>
            <p className="text-xs text-muted-foreground">Director, ICES</p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code for verification"
                className="mb-2 h-24 w-24 rounded-lg"
              />
            ) : (
              <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                <span className="text-xs text-muted-foreground">QR Code</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Scan to verify</p>
          </div>
        </div>

        {/* Verification URL */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Verify at: {window.location.origin}/verify/{student.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
