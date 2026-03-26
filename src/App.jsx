import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
    Box,
    Button,
    ChakraProvider,
    Flex,
    Heading,
    Spinner,
    Stack,
    Text,
    theme,
} from '@chakra-ui/react';
import QuizPage from './components/QuizPage.jsx';
import './App.css';

const StudyGuide = lazy(() => import('./components/StudyGuide.jsx'));

function getViewFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'guide' ? 'guide' : 'practice';
}

function updateUrlView(nextView) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', nextView);
    if (nextView !== 'guide') {
        url.searchParams.delete('section');
    }
    window.history.pushState({}, '', url);
}

function App() {
    const [view, setView] = useState(getViewFromUrl());

    useEffect(() => {
        function onPopState() {
            setView(getViewFromUrl());
        }

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    function onSelectView(nextView) {
        if (nextView === view) {
            return;
        }

        updateUrlView(nextView);
        setView(nextView);
    }

    return (
        <ChakraProvider theme={theme}>
            <Flex className='app-shell' direction='column'>
                <Flex
                    as='header'
                    className='app-header'
                    align='center'
                    justify='space-between'
                    gap={4}
                    wrap='wrap'
                >
                    <Box>
                        <Heading as='h1' size='lg'>
                            Quiz Patente AB
                        </Heading>
                        <Text color='gray.600' fontSize='sm'>
                            Practice mode and study guide in one app.
                        </Text>
                    </Box>
                    <Stack direction='row' spacing={3}>
                        <Button
                            colorScheme={view === 'practice' ? 'teal' : 'gray'}
                            onClick={() => onSelectView('practice')}
                            variant={view === 'practice' ? 'solid' : 'outline'}
                        >
                            Practice
                        </Button>
                        <Button
                            colorScheme={view === 'guide' ? 'teal' : 'gray'}
                            onClick={() => onSelectView('guide')}
                            variant={view === 'guide' ? 'solid' : 'outline'}
                        >
                            Study Guide
                        </Button>
                    </Stack>
                </Flex>
                <Box as='main' className='app-main'>
                    {view === 'guide' ? (
                        <Suspense fallback={<Spinner size='xl' thickness='4px' />}>
                            <StudyGuide />
                        </Suspense>
                    ) : (
                        <QuizPage />
                    )}
                </Box>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
