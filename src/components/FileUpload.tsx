import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { parseExcelFile } from "@/lib/excelParser";
import { addStudents } from "@/lib/studentStorage";

const FileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx, .xls) or CSV file.",
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
      });
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const students = await parseExcelFile(file);
      
      if (students.length === 0) {
        throw new Error("No valid student records found");
      }
      
      addStudents(students);
      setProcessedCount(students.length);
      
      // Dispatch custom event to notify StudentList
      window.dispatchEvent(new CustomEvent("studentsUpdated"));
      
      toast({
        title: "Processing Complete",
        description: `Successfully generated ${students.length} certificate(s).`,
      });
      
      // Reset for next upload
      setFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProcessedCount(0);
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Upload Student Data
            </h2>
            <p className="text-lg text-muted-foreground">
              Upload your Excel file containing student information to generate certificates
            </p>
          </div>

          <Card className="shadow-card border-2 border-dashed border-border overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Excel File Upload
              </CardTitle>
              <CardDescription>
                Supported formats: .xlsx, .xls, .csv (max 10MB)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {!file ? (
                <div
                  className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  
                  <div className={`mb-4 rounded-full p-4 transition-colors ${
                    isDragOver ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Upload className={`h-8 w-8 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  
                  <p className="mb-2 text-center text-sm font-medium text-foreground">
                    {isDragOver ? "Drop your file here" : "Drag & drop your Excel file"}
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    or click to browse from your computer
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {isProcessing && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      Choose Different File
                    </Button>
                    <Button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Generate Certificates"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required Columns Info */}
          <div className="mt-8 rounded-lg bg-muted/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <AlertCircle className="h-4 w-4 text-primary" />
              Required Excel Columns
            </h3>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Student Name",
                "Email",
                "Mobile Number",
                "Address",
                "Batch Number",
                "Course Name",
                "Course Start Date",
                "Course End Date",
                "Certificate Issue Date",
              ].map((column) => (
                <div key={column} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {column}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
