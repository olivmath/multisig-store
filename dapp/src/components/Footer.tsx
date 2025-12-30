import { Github, Linkedin, FileCode } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          © 2025 MultiSig Store @{" "}
          <a
            href="https://github.com/olivmath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            olivmath
          </a>
          {" "}- All rights reserved
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://sepolia.etherscan.io/address/0x76ADE170939349b9Ec9730342962b32443601c29#code"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            title="View Contract"
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">Contract</span>
          </a>
          <a
            href="https://www.linkedin.com/in/olivmath/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a
            href="https://github.com/olivmath/multisig-store"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
