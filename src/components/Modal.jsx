import { useEffect, useState } from 'react';
import Fireworks from './Fireworks';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      setShowFireworks(true);
    } else {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
      setShowFireworks(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
      setShowFireworks(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {showFireworks && <Fireworks />}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal; 