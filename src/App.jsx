import React, { useState } from 'react';
import {
    Box,
    Button,
    ChakraProvider,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    theme,
} from '@chakra-ui/react';
import QuizPage from './components/QuizPage.jsx';
import './App.css';

function SplashPage({ onStartQuiz }) {
    return (
        <Flex className='splash' align='center' justify='center' direction='column'>
            <Box className='splash-card'>
                <Image
                    src='/LogoLarge.png'
                    alt='Italian Drivers License — Quiz and Study Guide for English Speakers'
                    className='splash-logo'
                />
                <Heading as='h2' size='lg' mt={6} mb={3} textAlign='center'>
                    Prepare for the Italian Patente A &amp; B Exam
                </Heading>
                <Text className='splash-description'>
                    This free toolkit helps English speakers study for the Italian driving theory
                    exam. Choose the <strong>Study Guide</strong> to learn road signs, traffic rules,
                    and the Italian driving philosophy — or jump straight into the{' '}
                    <strong>Practice Quiz</strong> to drill real exam questions.
                </Text>
                <Text className='splash-description' fontSize='sm' mt={0}>
                    Quiz questions are in Italian, just like the real exam. For side-by-side English
                    translations, we recommend the free{' '}
                    <a
                        href='https://immersivetranslate.com/'
                        target='_blank'
                        rel='noreferrer'
                        style={{ color: '#319795', textDecoration: 'underline' }}
                    >
                        Immersive Translate
                    </a>{' '}
                    browser extension — it lets you toggle translations on and off while you study.
                </Text>
                <Stack className='splash-actions' direction={{ base: 'column', sm: 'row' }} spacing={4}>
                    <Button
                        as='a'
                        href='/docs/italian-drivers-license-study-guide.html'
                        target='_blank'
                        rel='noreferrer'
                        colorScheme='teal'
                        size='lg'
                        variant='outline'
                        className='splash-btn'
                    >
                        Study Guide ↗
                    </Button>
                    <Button
                        colorScheme='teal'
                        size='lg'
                        className='splash-btn'
                        onClick={onStartQuiz}
                    >
                        Practice Quiz
                    </Button>
                </Stack>
                <Text className='splash-hint'>
                    You can also{' '}
                    <a
                        href='/docs/italian-drivers-license-study-guide.html'
                        download='italian-drivers-license-study-guide.html'
                    >
                        download the study guide
                    </a>{' '}
                    as a single HTML file for offline use.
                </Text>
            </Box>
        </Flex>
    );
}

function App() {
    const [view, setView] = useState('splash');

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
                    <Flex
                        align='center'
                        gap={3}
                        cursor='pointer'
                        onClick={() => setView('splash')}
                    >
                        <Image
                            src='/LogoSmall.png'
                            alt='Italian Drivers License'
                            className='header-logo'
                        />
                    </Flex>
                    <Stack direction='row' spacing={3}>
                        <Button
                            as='a'
                            href='/docs/italian-drivers-license-study-guide.html'
                            target='_blank'
                            rel='noreferrer'
                            colorScheme='teal'
                            variant='outline'
                            size='sm'
                        >
                            Study Guide ↗
                        </Button>
                        <Button
                            as='a'
                            href='/docs/italian-drivers-license-study-guide.html'
                            download='italian-drivers-license-study-guide.html'
                            colorScheme='teal'
                            variant='solid'
                            size='sm'
                        >
                            Download Guide
                        </Button>
                    </Stack>
                </Flex>
                <Box as='main' className='app-main'>
                    {view === 'splash' ? (
                        <SplashPage onStartQuiz={() => setView('quiz')} />
                    ) : (
                        <QuizPage />
                    )}
                </Box>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
