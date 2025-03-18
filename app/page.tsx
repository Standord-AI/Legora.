import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold flex items-center gap-2">
              <Image
                src={"logo/logo_no_bg.png"}
                alt="Legora logo"
                height={100}
                width={200}
              />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-muted">
        <div className="container flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Legora: AI-Powered Legal Compliance for Employment Contracts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ensure your employment contracts comply with current laws and
              regulations using our advanced AI system.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="relative w-full max-w-4xl mt-8 rounded-lg overflow-hidden shadow-xl">
            <Image src={'ss/Screenshot2.png'} alt="legora" height={1000} width={1000} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven system automates legal compliance checks for
              employment contracts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-6 border rounded-lg"
              >
                <div className="p-2 rounded-full bg-primary/10 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 bg-muted">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple process, powerful results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-8 p-8 md:p-12 rounded-lg bg-primary text-primary-foreground">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to ensure compliance?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of companies using our AI to automate legal
                compliance checks.
              </p>
            </div>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Sign Up Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 md:px-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold flex items-center gap-2">
              <Image
                src={"logo/logo_no_bg_small.png"}
                alt="Legora logo"
                height={50}
                width={100}
              />
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Legora. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: CheckCircle,
    title: "Automated Compliance Checks",
    description:
      "Our AI analyzes contracts against current laws, regulations, and legal judgments to ensure compliance.",
  },
  {
    icon: FileText,
    title: "Compliance Reports",
    description:
      "Receive detailed reports highlighting potential risks and suggested corrective actions.",
  },
  {
    icon: Shield,
    title: "Legal Database Integration",
    description:
      "Access a comprehensive, continuously updated legal database reflecting the latest standards.",
  },
  {
    icon: CheckCircle,
    title: "Explainable AI",
    description:
      "Understand the rationale behind compliance assessments with transparent explanations.",
  },
  {
    icon: FileText,
    title: "Contract Templates",
    description:
      "Access a library of legally compliant contract templates for various employment scenarios.",
  },
  {
    icon: Shield,
    title: "Continuous Monitoring",
    description:
      "Stay compliant as legal standards evolve with ongoing monitoring and updates.",
  },
];

const steps = [
  {
    title: "Upload Contract",
    description:
      "Simply upload your employment contract PDF through our secure dashboard.",
  },
  {
    title: "AI Analysis",
    description:
      "Our AI system analyzes the contract against current legal standards and regulations.",
  },
  {
    title: "Review Results",
    description:
      "Receive a detailed compliance report and chat with our AI to understand the findings.",
  },
];
