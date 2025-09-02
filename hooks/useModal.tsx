'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, Box, Typography, SxProps } from '@mui/material';
import Frame from '@/components/UI/Frame/Frame';

interface ModalOptions {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
  size?: number | null; // если null — не задаем width
  sx?: SxProps; // дополнительные стили
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal должен быть использован внутри ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalOptions[]>([]);

  const showModal = (options: ModalOptions) => {
    setModalStack((prev) => [...prev, options]);
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const currentModal = modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      <Modal open={currentModal != null} onClose={closeModal}>
        {currentModal ? (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '90vh',
              width: currentModal.size == null ? null : 400, // если size не передан, ставим 400
              ...currentModal.sx,
            }}
          >
            {currentModal.title && <Typography variant="h6">{currentModal.title}</Typography>}
            {currentModal.content}
            {currentModal.actions && <Box>{currentModal.actions}</Box>}
          </Box>
        ) : <Box />}
      </Modal>
    </ModalContext.Provider>
  );
};
