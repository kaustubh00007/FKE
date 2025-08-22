import React, { useState, useRef, useEffect } from 'react';
import { Paper, TextField, IconButton, Typography, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const AiChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages.slice(-10),
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const aiMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, I\'m having trouble responding right now. Please try again later.' 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper 
      elevation={3}
      className="w-full max-w-md mx-auto h-96 flex flex-col animate-slide-in"
    >
      <Box className="flex items-center gap-2 p-3 border-b bg-blue-600 text-white rounded-t-lg">
        <SmartToyIcon />
        <Typography variant="h6">AI Assistant</Typography>
      </Box>

      <Box className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Paper
              className={`max-w-[80%] p-2 ${
                msg.role === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900 text-right'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <Typography variant="body2">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box className="flex justify-start">
            <Paper className="bg-gray-100 dark:bg-gray-700 p-2">
              <Typography variant="body2">Thinking...</Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="flex gap-2 p-3 border-t">
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <IconButton 
          onClick={sendMessage} 
          disabled={!input.trim() || isLoading}
          color="primary"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AiChatbot;