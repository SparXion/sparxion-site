import { Link } from 'react-router-dom';
import SparxionLanding from '../assets/Sparxion_Landing-003.svg';

export function HomePage() {

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      position: 'relative', 
      width: '100%', 
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '1200px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
          <img 
            src={SparxionLanding} 
            alt="SparXion - connecting humans with ai" 
            style={{ 
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: '50px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10, 
        width: '100%', 
        textAlign: 'center',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        {/* Tagline */}
        <p className="text-body mb-medium" style={{ color: '#000000' }}>
          delivering delight at human scale
        </p>
        
        {/* Primary CTAs - External Apps & Contact */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '30px' 
        }}>
          <Link 
            to="/ucid" 
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Explore UCID App →
          </Link>
          <a 
            href="https://aitunerapp.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            AI Tuner App →
          </a>
          <Link 
            to="/contact"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Contact →
          </Link>
        </div>

        {/* Internal Site Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          paddingTop: '30px', 
          borderTop: '1px solid #e0e0e0' 
        }}>
          <Link 
            to="/journey"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            John's Journey
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/portfolio"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Portfolio
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/software"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Software
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/ethos"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Ethos
          </Link>
        </div>
      </div>
    </div>
  );
}
