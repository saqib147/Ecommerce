import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  LinearProgress, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  textAlign: 'center',
  maxWidth: '600px',
  margin: '40px auto',
}));

const StatusEmoji = styled(Typography)({
  fontSize: '3rem',
  marginBottom: '1rem',
});

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Using axios without any auth headers since this is a public endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/track`, {
        validateStatus: function (status) {
          return status < 500; // Accept all status codes less than 500
        }
      });

      if (response.status === 304) {
        setError('Order information has not changed');
      } else if (response.status === 404) {
        setError('Order not found. Please check your order ID and try again.');
      } else if (response.status === 200) {
        setOrderStatus(response.data);
      } else {
        setError('Unable to fetch order status. Please try again later.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please check your internet connection and try again.');
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Track Your Order
        </Typography>
        
        <Box component="form" onSubmit={handleTrackOrder} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            margin="normal"
            required
            error={!!error}
            placeholder="Enter your order ID"
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            disabled={loading || !orderId}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Tracking...</span>
              </Box>
            ) : (
              'TRACK ORDER'
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {orderStatus && (
          <Box sx={{ mt: 4 }}>
            <StatusEmoji>{orderStatus.emoji || '📦'}</StatusEmoji>
            
            <Typography variant="h6" gutterBottom>
              {orderStatus.message || 'Status not available'}
            </Typography>

            <Box sx={{ mt: 2, mb: 4 }}>
              <LinearProgress 
                variant="determinate" 
                value={orderStatus.progress || 0} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4CAF50'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {orderStatus.progress || 0}% Complete
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Status: {orderStatus.status || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order Created: {formatDate(orderStatus.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {formatDate(orderStatus.updatedAt)}
              </Typography>
            </Box>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default OrderTracking;