

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} FIR Automation System. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
