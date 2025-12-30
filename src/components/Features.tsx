import { Upload, FileCheck, QrCode, Download, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Bulk Upload",
    description: "Upload Excel files with multiple student records and process them all at once.",
  },
  {
    icon: FileCheck,
    title: "Auto Generation",
    description: "Certificates are automatically generated with professional formatting and design.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    description: "Each certificate gets a unique QR code linking to its verification page.",
  },
  {
    icon: Shield,
    title: "Tamper-Proof",
    description: "Certificates are securely stored and cannot be modified after generation.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Download high-quality PDF certificates ready for printing or digital sharing.",
  },
  {
    icon: Clock,
    title: "Instant Verification",
    description: "Anyone can instantly verify certificate authenticity by scanning the QR code.",
  },
];

const Features = () => {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A streamlined process from data upload to verified certificates
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl bg-card p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
