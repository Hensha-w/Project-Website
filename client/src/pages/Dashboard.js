import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Container,
    Alert,
    Button
} from '@mui/material';
import {
    Folder as FolderIcon,
    Payment as PaymentIcon,
    Settings as SettingsIcon,
    Feedback as FeedbackIcon,
    Logout as LogoutIcon,
    Add as AddIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const [adminPhone, setAdminPhone] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, component: 'dashboard' },
        { text: 'My Projects', icon: <FolderIcon />, component: 'projects' },
        { text: 'Create Project', icon: <AddIcon />, component: 'create' },
        { text: 'Payment', icon: <PaymentIcon />, component: 'payment' },
        { text: 'Settings', icon: <SettingsIcon />, component: 'settings' },
        { text: 'Feedback', icon: <FeedbackIcon />, component: 'feedback' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Welcome, {user?.name}!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This is your dashboard. Use the sidebar to navigate through the application.
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions:
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mr: 2 }}
                                onClick={() => setActiveComponent('create')}
                            >
                                Create New Project
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setActiveComponent('projects')}
                            >
                                View My Projects
                            </Button>
                        </Box>
                    </Box>
                );
            case 'create':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Create New Project
                        </Typography>
                        <Typography color="textSecondary">
                            Project creation form will appear here.
                        </Typography>
                    </Box>
                );
            case 'projects':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            My Projects
                        </Typography>
                        <Typography color="textSecondary">
                            Your projects will appear here.
                        </Typography>
                    </Box>
                );
            case 'payment':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Payment Section
                        </Typography>
                        <Typography color="textSecondary">
                            Payment interface will appear here.
                        </Typography>
                    </Box>
                );
            default:
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}
                        </Typography>
                        <Typography color="textSecondary">
                            Content for {activeComponent} will appear here.
                        </Typography>
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {adminPhone && (
                <Alert
                    severity="info"
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2000,
                        mt: 7
                    }}
                >
                    Contact Developer: {adminPhone}
                </Alert>
            )}

            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Final Year Projects Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.email}
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => setActiveComponent(item.component)}
                                selected={activeComponent === item.component}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="lg">
                    {renderComponent()}
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;