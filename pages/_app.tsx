import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {ThemeProvider} from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {CacheProvider, EmotionCache} from '@emotion/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import {useState} from 'react';
import {DrawerAppBar} from '../src/components/DrawerAppBar';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const globalStyles = <GlobalStyles styles={{
  body: {
    backgroundColor: theme.palette.primary.main,
  },
}}/>;

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <Hydrate state={pageProps.dehydratedState}>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta name="viewport"
                    content="initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                {globalStyles}
                <DrawerAppBar>
                  <Component {...pageProps} />
                </DrawerAppBar>
              </LocalizationProvider>
            </ThemeProvider>
          </CacheProvider>
        </Hydrate>
        <ReactQueryDevtools/>
      </QueryClientProvider>
  );
}
