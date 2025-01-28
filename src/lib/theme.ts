import { createTheme } from '@mui/material/styles';

const unoTheme = createTheme({
    palette: {
        primary: {
            main: '#1976D2', // Uno blue
        },
        secondary: {
            main: '#388E3C', // Uno green
        },
        info: {
            main: '#D32F2F', // Uno red
        },
        warning: {
            main: '#FBC02D', // Uno yellow
        },
        error: {
            main: '#D32F2F', // Also Uno red
        },
        background: {
            default: '#FAFAFA', // Light gray background for contrast
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif', // A fun, clean Google Font
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        button: {
            fontWeight: 600,
            textTransform: 'uppercase',
        },
    },
    components: {
        // MuiButton: {
        //     styleOverrides: {
        //         root: {
        //             borderRadius: '50px', // Rounded buttons for a fun look
        //             fontWeight: 700,
        //             padding: '10px 20px',
        //             background: '#0956BF', // Gradient for buttons
        //             color: '#FFFFFF',
        //             '&:hover': {
        //                 background: '#0845AE', // Reverse gradient on hover
        //             },
        //         },
        //     },
        // },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '15px', // Rounded cards
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Soft shadow for a playful pop
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, #D32F2F, #1976D2)', // Uno red to blue gradient
                    color: '#FFFFFF',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                },
            },
        },
    },
});

export default unoTheme;
