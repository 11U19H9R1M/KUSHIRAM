
import { Link } from "react-router-dom";
import { Archive, Github, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Archive className="w-6 h-6 text-primary" />
              <span className="font-medium text-xl tracking-tight">TimeVault</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              A beautiful digital time capsule platform to preserve your memories and thoughts for future discovery.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:contact@timevault.example" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">Site</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">My Capsules</Link></li>
              <li><Link to="/create" className="text-foreground hover:text-primary transition-colors">Create New</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TimeVault. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Designed with precision and care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
