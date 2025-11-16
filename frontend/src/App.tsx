import RobotDashboard from '@/components/RobotDashboard';
import RobotDetail from '@/components/RobotDetail';
import { RobotProvider } from '@/contexts/RobotContext';
import { industrialTheme } from '@/theme';
import { GlobalStyles } from '@/theme/GlobalStyles';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';

const AppContent: React.FC = () => {
  const [selectedRobotId, setSelectedRobotId] = useState<number | null>(null);

  const handleBackToDashboard = () => {
    setSelectedRobotId(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: industrialTheme.palette.background.default }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: industrialTheme.custom?.gradients?.primary,
          boxShadow: industrialTheme.custom?.shadows?.header,
        }}
      >
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Industrial Robot Monitor
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {selectedRobotId ? (
          <RobotDetail 
            robotId={selectedRobotId} 
            onBack={handleBackToDashboard}
          />
        ) : (
          <RobotDashboard onRobotClick={setSelectedRobotId} />
        )}
      </Container>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={industrialTheme}>
      <CssBaseline />
      <GlobalStyles />
      <RobotProvider>
        <AppContent />
      </RobotProvider>
    </ThemeProvider>
  );
};

export default App;