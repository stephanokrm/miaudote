import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {FC, PropsWithChildren, useMemo} from 'react';
import PetsIcon from '@mui/icons-material/Pets';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {useGetUserByMeQuery} from '../hooks/queries/useGetUserByMeQuery';
import {LinkProps} from 'next/link';
import {useLogoutMutation} from '../hooks/mutations/useLogoutMutation';
import {useRouter} from 'next/router';

interface DrawerAppBarProps {
  window?: () => Window;
}

const drawerWidth = 240;

type NavigationItem = {
  label: string,
  href: LinkProps['href'],
  guarded: boolean,
}

type SettingItem = {
  label: string,
  onClick: () => Promise<void>,
}

export const DrawerAppBar: FC<PropsWithChildren<DrawerAppBarProps>> = (props) => {
  const {window, children} = props;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
      null);
  const {data: user} = useGetUserByMeQuery();
  const {mutate: logout} = useLogoutMutation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const settings: SettingItem[] = useMemo(() => ([
    {
      label: 'Conta',
      onClick: async () => {
        handleCloseUserMenu();

        await router.push('/user/edit');
      },
    },
    {
      label: 'Sair',
      onClick: async () => {
        handleCloseUserMenu();

        await logout({});
      },
    },
  ]), [logout, router]);

  const navigations: NavigationItem[] = useMemo(() => ([
    {
      label: 'Home',
      guarded: false,
      href: '/',
    },
    {
      label: 'Doar',
      guarded: false,
      href: '/animal/create',
    },
    {
      label: 'Interessados',
      guarded: true,
      href: '/interests',
    },
    {
      label: 'Meus Interesses',
      guarded: true,
      href: '/interests/me',
    },
    {
      label: 'Minhas Doações',
      guarded: true,
      href: '/animal/me',
    },
    ...user ? [] : [
      {
        label: 'Entrar',
        guarded: false,
        href: '/login',
      }],
  ].filter(({guarded}) => !guarded || (guarded && user))), [user]);

  const drawer = (
      <Box onClick={handleDrawerToggle}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <PetsIcon sx={{mr: 1}} color="primary"/>
          <Typography variant="h6" sx={{
            my: 2,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
          }}>
            MIAUDOTE
          </Typography>
        </Box>
        <Divider/>
        <List>
          {navigations.map((item) => (
              <ListItem key={item.label} disablePadding>
                <Link href={item.href} passHref>
                  <ListItemButton>
                    <ListItemText primary={item.label}/>
                  </ListItemButton>
                </Link>
              </ListItem>
          ))}
          {user ? (
              <ListItem key="Sair" disablePadding>
                <ListItemButton onClick={logout}>
                  <ListItemText primary="Sair"/>
                </ListItemButton>
              </ListItem>
          ) : null}
        </List>
      </Box>
  );

  const container = window !== undefined
      ? () => window().document.body
      : undefined;

  return (
      <Box>
        <AppBar component="nav">
          <Toolbar>
            <Container maxWidth="xl">
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{mr: 2, display: {sm: 'none'}}}
              >
                <MenuIcon/>
              </IconButton>
              <Box display="flex" alignItems="center" flexGrow={1}>
                <PetsIcon sx={{mr: 1}}/>
                <Link href="/" passHref>
                  <Typography
                      variant="h6"
                      component="a"
                      sx={{
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
                </Link>
              </Box>
              <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                {navigations.map((item) => (
                    <Link key={item.label} href={item.href} passHref>
                      <Button sx={{color: '#fff'}}>
                        {item.label}
                      </Button>
                    </Link>
                ))}
                {user ? (
                    <>
                      <Tooltip title="Configurações">
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
                        {settings.map((setting) => (
                            <MenuItem key={setting.label}
                                      onClick={async () => {
                                        handleCloseUserMenu();

                                        await setting.onClick();
                                      }}>
                              <Typography textAlign="center">
                                {setting.label}
                              </Typography>
                            </MenuItem>
                        ))}
                      </Menu>
                    </>
                ) : null}
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: {xs: 'block', sm: 'none'},
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main">
          <Toolbar/>
          <Container maxWidth="xl">
            {children}
          </Container>
        </Box>
      </Box>
  );
};
