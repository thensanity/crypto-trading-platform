import React, { useState } from 'react';
import {
  Fab,
  Badge,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import {
  Psychology,
  Chat,
  Close,
  SmartToy,
  AutoAwesome,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat from '../AIChat/AIChat';

function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setUnreadCount(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1 
        }}
      >
        <Tooltip title="AI Trading Assistant" placement="left">
          <Fab
            onClick={handleToggleChat}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
              },
              transition: 'all 0.3s ease',
              zIndex: 1000,
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              invisible={unreadCount === 0}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <Close /> : <Psychology />}
              </motion.div>
            </Badge>
          </Fab>
        </Tooltip>
      </motion.div>

      {/* Minimized Chat Indicator */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Tooltip title="Restore AI Chat" placement="left">
              <Fab
                onClick={handleRestore}
                size="small"
                sx={{
                  position: 'fixed',
                  bottom: 90,
                  right: 20,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e085f0 0%, #f04a5c 100%)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  zIndex: 1000,
                }}
              >
                <Chat />
              </Fab>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Component */}
      <AnimatePresence>
        {isOpen && (
          <AIChat
            isOpen={isOpen}
            onClose={handleClose}
            onMinimize={handleMinimize}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatButton;




