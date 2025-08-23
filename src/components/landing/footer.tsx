const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.1 0 .8-.4 1.5-.9 1.9-1 .8-2.7 1.2-4.1 1.1-2.4-.2-4.4-.1-6.6 0-3.3.2-6.3-1.6-8.2-4.1-1.9-2.4-2.2-5.3-1.6-7.8.6-2.5 2.4-4.5 4.8-5.8 2.4-1.3 5-1.5 7.4-1.2 2.4.3 4.5 1.5 6.2 3.2.9 1 1.5 2.2 1.5 3.5zm-1.1 6.9c-.3-1.1-1.2-2-2.4-2.3-1.2-.3-2.4.1-3.3.8-.9.7-1.4 1.8-1.4 2.9 0 1.1.5 2.2 1.4 2.9.9.7 2.1 1.1 3.3.8 1.2-.3 2.1-1.2 2.4-2.3.3-1.1-.1-2.3-1-3.1z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
);


export function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Paulik & Reisch. All rights reserved. And some wrongs.
        </p>
        <div className="flex gap-4 sm:ml-auto">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <InstagramIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
