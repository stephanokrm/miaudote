import React, {MouseEvent, useState} from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PetsIcon from '@mui/icons-material/Pets';
import useUser from "../hooks/useUser";

const pages = [
    {label: 'Adotar', url: '/'},
];

const ResponsiveAppBar = () => {
    const {user, logout} = useUser();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = async () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = async () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{width: '100%'}}>
                    <PetsIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    <Link href="/" passHref>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MIAUDOTE
                        </Typography>
                    </Link>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <Link key={page.label} href={page.url} passHref>
                                    <MenuItem key={page.label}>
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <PetsIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        MIAUDOTE
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Link key={page.label} href={page.url} passHref>
                                <Button
                                    key={page.label}
                                    variant="text"
                                    size="large"
                                    sx={{color: 'white'}}
                                >
                                    {page.label}
                                </Button>
                            </Link>
                        ))}
                        {user ? (
                            <Link href={{pathname: '/user/[id]/animal/create', query: {id: user.id}}} passHref>
                                <Button
                                    key="Doar"
                                    variant="text"
                                    size="large"
                                    sx={{color: 'white'}}
                                >
                                    Doar
                                </Button>
                            </Link>
                        ) : null}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        {user ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar alt={user.name} src="/static/images/avatar/2.jpg"/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '45px'}}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <Link href={{pathname: '/user/[id]', query: {id: user.id}}} passHref>
                                        <MenuItem key="Conta">
                                            <Typography textAlign="center">Conta</Typography>
                                        </MenuItem>
                                    </Link>
                                    <MenuItem key="Sair" onClick={logout}>
                                        <Typography textAlign="center">Sair</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="text"
                                        size="large"
                                        sx={{color: 'white'}}>
                                    Entrar
                                </Button>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ResponsiveAppBar;
