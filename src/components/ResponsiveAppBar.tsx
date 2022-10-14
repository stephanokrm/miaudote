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
import useGetUserByMeQuery from "../hooks/queries/useGetUserByMeQuery";
import {useLogoutMutation} from "../hooks/mutations/useLogoutMutation";

const pages = [
    {label: 'Adotar', url: '/'},
];

const ResponsiveAppBar = () => {
    const {data: user} = useGetUserByMeQuery();
    const {mutate} = useLogoutMutation();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const authenticated = !!user;

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
                            {authenticated ? (
                                <Link href="/animal/create" passHref>
                                    <MenuItem key="Doar">
                                        <Typography textAlign="center">Doar</Typography>
                                    </MenuItem>
                                </Link>
                            ) : null}
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
                        {authenticated ? (
                            <Link href="/animal/create" passHref>
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
                        {authenticated ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar alt={user.name} src={user.avatar}/>
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
                                    <Link href="/user/edit" passHref>
                                        <MenuItem key="Conta" onClick={() => handleCloseUserMenu()}>
                                            <Typography textAlign="center">Minha Conta</Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link href="/animal/me" passHref>
                                        <MenuItem key="Doações" onClick={() => handleCloseUserMenu()}>
                                            <Typography textAlign="center">Minhas Doações</Typography>
                                        </MenuItem>
                                    </Link>
                                    <MenuItem key="Sair" onClick={mutate}>
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
