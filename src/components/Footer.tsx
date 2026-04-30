import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-bold border-black bg-white">
      <div className="max-w-[1600px] mx-auto px-medium py-large">
        <div className="flex flex-col md:flex-row justify-between items-center gap-medium">
          <div className="text-small text-medium-gray">
            © {new Date().getFullYear()} SparXion. Where your spark meets action.
          </div>
          <div className="flex gap-medium">
            <Link to="/contact" className="text-small text-medium-gray hover:text-black transition-standard">
              Contact
            </Link>
            <a 
              href="mailto:john@sparxion.com" 
              className="text-small text-medium-gray hover:text-black transition-standard"
            >
              john@sparxion.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
