import { Award, Shield, QrCode } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm animate-fade-in-up">
            <Shield className="h-4 w-4" />
            Trusted Certificate Verification System
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Generate & Verify
            <span className="block mt-2">Authentic Certificates</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A secure platform for generating professional certificates with QR-code verification. 
            Upload your data, generate certificates, and let anyone verify authenticity instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Award, label: "Professional Certificates" },
              { icon: QrCode, label: "QR Verification" },
              { icon: Shield, label: "Tamper-Proof" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm"
              >
                <item.icon className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 lg:h-16"
          viewBox="0 0 1440 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 22L60 16.7C120 11.3 240 0.7 360 0.2C480 -0.3 600 9.3 720 16.7C840 24 960 29 1080 26.8C1200 24.7 1320 15.3 1380 10.7L1440 6V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
