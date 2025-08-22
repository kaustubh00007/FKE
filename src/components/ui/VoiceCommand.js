import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Paper, Button, Typography, Box, Chip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { toast } from 'react-toastify';

const VoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();

    recognition.current.continuous = false;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onstart = () => {
      setIsListening(true);
      toast.info('Voice recognition started. Speak now!');
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error(`Speech recognition error: \${event.error}`);
    };

    recognition.current.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const speechResult = result[0].transcript;
      const confidenceLevel = result[0].confidence || 0;

      setTranscript(speechResult);
      setConfidence(confidenceLevel);

      if (result.isFinal) {
        processVoiceCommand(speechResult);
      }
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      toast.success('Hello! Voice command recognized!');
    } else if (lowerCommand.includes('clear')) {
      setTranscript('');
      toast.info('Cleared transcript');
    } else if (lowerCommand.includes('time')) {
      const currentTime = new Date().toLocaleTimeString();
      toast.info(`Current time: \${currentTime}`);
    } else {
      toast.success(`Command received: "\${command}"`);
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.current?.stop();
    } else {
      setTranscript('');
      setConfidence(0);
      recognition.current?.start();
    }
  };

  if (!isSupported) {
    return (
      <Paper elevation={2} className="p-4 max-w-md mx-auto">
        <Typography variant="h6" className="mb-2 text-center">
          Voice Commands
        </Typography>
        <Typography color="error" className="text-center">
          Speech recognition not supported in this browser.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} className="p-4 max-w-md mx-auto animate-slide-in">
      <Typography variant="h6" className="mb-4 text-center font-semibold">
        Voice Commands
      </Typography>

      <Box className="flex flex-col items-center space-y-4">
        <Button
          variant="contained"
          size="large"
          onClick={toggleListening}
          startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
          className={`transition-all duration-300 \${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>

        {isListening && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <Typography variant="body2" color="text.secondary">
              Listening...
            </Typography>
          </div>
        )}

        {transcript && (
          <Box className="w-full space-y-2">
            <Typography variant="body2" className="font-medium">
              You said:
            </Typography>
            <Paper className="p-3 bg-blue-50 dark:bg-blue-900/20">
              <Typography variant="body1">"{transcript}"</Typography>
            </Paper>
            {confidence > 0 && (
              <Chip 
                label={`Confidence: \${Math.round(confidence * 100)}%`}
                size="small"
                color={confidence > 0.7 ? 'success' : confidence > 0.4 ? 'warning' : 'error'}
              />
            )}
          </Box>
        )}

        <Box className="text-center space-y-1">
          <Typography variant="body2" color="text.secondary">
            Try saying:
          </Typography>
          <div className="flex flex-wrap gap-1 justify-center">
            {['Hello', 'What time is it?', 'Clear'].map((cmd) => (
              <Chip key={cmd} label={cmd} size="small" variant="outlined" />
            ))}
          </div>
        </Box>
      </Box>
    </Paper>
  );
};

export default VoiceCommand;