import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMessages, sendMessage } from '../api/users';
import { useUser } from '../contexts/UserContext';

const MessagingPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (userId) {
          const fetchedMessages = await getMessages(userId);
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to fetch messages');
      }
    };

    if (userId && user) {
      fetchMessages();
      ws.current = new WebSocket(`ws://localhost:3001/?userId=${user.id}`);

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        toast.success('WebSocket connection success');
      };

      ws.current.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, messageData]);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        // toast.error('WebSocket connection error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [userId, user]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (userId && message.trim()) {
      try {
        await sendMessage(userId, message);
        setMessages(prevMessages => [...prevMessages, { senderId: user.id, content: message }]);
        setMessage('');
      } catch (error) {
        toast.error('Failed to send message');
        console.error('Failed to send message:', error);
      }
    } else {
      toast.error('Message cannot be empty or user ID is invalid');
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" height="85vh">
      <ToastContainer />
      <Typography variant="h4">Messaging User {userId}</Typography>
      <Paper
        variant="outlined"
        sx={{ flex: 1, mt: 2, p: 2, overflowY: 'auto' }}
        ref={messageContainerRef}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.senderId != user.id ? 'flex-start' : 'flex-end'}
            mb={1}
          >
            <Paper
              elevation={3}
              sx={{
                p: 1.5,
                backgroundColor: msg.senderId != user.id ? '#fff3e0' : '#e0f7fa',
                maxWidth: '70%',
              }}
            >
              <Typography>{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
      </Paper>
      <Box display="flex" justifyContent="center" mt={2}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ ml: 2, mt: 1, alignSelf: 'center', height: '56px' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default MessagingPage;
