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
                    This free toolkit helps English speakers master the Italian driving theory
                    exam. Explore the <strong>Study Guide</strong>, the{' '}
                    <strong>Trick Heuristics Playbook</strong>, and the{' '}
                    <strong>Bilingual Glossary</strong> — or jump straight into the{' '}
                    <strong>Practice Quiz</strong> to drill all 6,963 official questions.
                </Text>
                <Text className='splash-description' fontSize='sm' mt={0}>
                    Built-in domain-verified English translations (Peek / IT + EN), bilingual
                    theory hints, optional spoiler-free <strong>Trap</strong> indicators, and
                    post-answer rule heuristics are included directly inside the quiz — no
                    translation extension required.
                </Text>
                <Stack className='splash-actions' direction={{ base: 'column', sm: 'row' }} spacing={3} wrap='wrap'>
                    <Button
                        colorScheme='teal'
                        size='lg'
                        className='splash-btn'
                        onClick={onStartQuiz}
                    >
                        Practice Quiz
                    </Button>
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
                        as='a'
                        href='/docs/patente-heuristics-playbook.html'
                        target='_blank'
                        rel='noreferrer'
                        colorScheme='orange'
                        size='lg'
                        variant='outline'
                        className='splash-btn'
                    >
                        Trap Playbook ↗
                    </Button>
                    <Button
                        as='a'
                        href='/docs/patente-glossary.html'
                        target='_blank'
                        rel='noreferrer'
                        colorScheme='teal'
                        size='lg'
                        variant='ghost'
                        className='splash-btn'
                    >
                        Glossary ↗
                    </Button>
                </Stack>
                <Text className='splash-hint'>
                    Download offline HTML:{' '}
                    <a
                        href='/docs/italian-drivers-license-study-guide.html'
                        download='italian-drivers-license-study-guide.html'
                    >
                        Study Guide
                    </a>
                    {' · '}
                    <a
                        href='/docs/patente-heuristics-playbook.html'
                        download='patente-heuristics-playbook.html'
                    >
                        Trap Playbook
                    </a>
                    {' · '}
                    <a
                        href='/docs/patente-glossary.html'
                        download='patente-glossary.html'
                    >
                        Glossary
                    </a>
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
                    <Stack direction='row' spacing={2} wrap='wrap'>
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
                            href='/docs/patente-heuristics-playbook.html'
                            target='_blank'
                            rel='noreferrer'
                            colorScheme='orange'
                            variant='outline'
                            size='sm'
                        >
                            Trap Playbook ↗
                        </Button>
                        <Button
                            as='a'
                            href='/docs/patente-glossary.html'
                            target='_blank'
                            rel='noreferrer'
                            colorScheme='teal'
                            variant='outline'
                            size='sm'
                        >
                            Glossary ↗
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
