import { useContext } from 'react';
import { ModalContext } from './ModalContext';

export const useModal = () => {
  const ctx = useContext(ModalContext as any);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx as { showModal: (opts: { title?: string; message: string; showCancel?: boolean }) => Promise<boolean> };
};
