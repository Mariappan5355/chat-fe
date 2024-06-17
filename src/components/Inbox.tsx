import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getInboxMessages } from '../api/users';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  senderName: string;
}

const Inbox: React.FC = () => {
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchInboxMessages = async () => {
      try {
        const messages = await getInboxMessages();
        setInboxMessages(messages);
      } catch (error) {
        console.error('Error fetching inbox messages:', error);
        toast.error('Failed to fetch inbox messages');
      }
    };

    fetchInboxMessages();
  }, []);

  const handleMessageClick = (userId: string) => {
    navigate(`/dashboard/message/${userId}`); // Navigate to messaging page with userId
  };

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh" display="flex" flexDirection="column">
      <ToastContainer />
      <Typography variant="h4" mb={2} color="#3f51b5">Inbox</Typography>
      {inboxMessages.map((message) => (
        <Box
          key={message._id}
          mb={2}
          onClick={() => handleMessageClick(message.senderId)}
          sx={{ borderRadius: '12px', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
        >
          <Paper elevation={3} sx={{ p: 2, cursor: 'pointer', borderRadius: '12px', backgroundColor: '#fafafa' }}>
            <Typography variant="subtitle1" mb={1} color="#3f51b5">From: {message.senderName}</Typography>
            <Typography>{message.content}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default Inbox;
