import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, Target, Shield } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - ICES Certificate Portal</title>
        <meta 
          name="description" 
          content="Learn about ICES and our mission to provide authentic, verifiable certificates for continuing education programs." 
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-4 text-4xl font-bold text-primary-foreground lg:text-5xl">
                About ICES
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
                Institute of Continuing Education & Skills Development
              </p>
            </div>
          </section>

          {/* About Content */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    ICES is committed to providing high-quality continuing education programs 
                    that empower individuals with practical skills and knowledge. Our certificate 
                    verification system ensures the authenticity and integrity of every 
                    certificate we issue.
                  </p>
                </div>

                {/* Values */}
                <div className="grid gap-8 md:grid-cols-2">
                  {[
                    {
                      icon: Target,
                      title: "Our Mission",
                      description: "To provide accessible, quality education and verifiable credentials that enhance career opportunities for learners worldwide.",
                    },
                    {
                      icon: Users,
                      title: "Our Community",
                      description: "We've certified thousands of students across various programs, building a community of skilled professionals.",
                    },
                    {
                      icon: Award,
                      title: "Quality Assurance",
                      description: "Every certificate we issue meets rigorous standards and represents genuine achievement and competency.",
                    },
                    {
                      icon: Shield,
                      title: "Verification System",
                      description: "Our QR-code verification system provides instant, tamper-proof authentication of all certificates.",
                    },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="rounded-xl bg-card p-6 shadow-soft transition-all hover:shadow-card"
                    >
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Partnership Banner */}
                <div className="mt-12 rounded-xl bg-secondary p-8 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-secondary-foreground">
                    Partnered with Leading Institutions
                  </h3>
                  <p className="text-muted-foreground">
                    Including collaborations with IIT Ropar and other premier institutions 
                    to deliver cutting-edge educational programs.
                  </p>
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

export default About;
