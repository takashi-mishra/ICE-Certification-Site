import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ICES Certificate Portal - Generate & Verify Certificates</title>
        <meta 
          name="description" 
          content="Generate professional certificates with QR code verification. Upload student data, create certificates, and verify authenticity instantly." 
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Hero />
          <FileUpload />
          <Features />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
