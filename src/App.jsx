import React from 'react';
import {
    Box,
    Button,
    ChakraProvider,
    Flex,
    Heading,
    Stack,
    Text,
    theme,
} from '@chakra-ui/react';
import QuizPage from './components/QuizPage.jsx';
import './App.css';

function App() {
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
                            Practice mode and study guide for the Italian driving exam.
                        </Text>
                    </Box>
                    <Stack direction='row' spacing={3}>
                        <Button
                            as='a'
                            href='/docs/italian-drivers-license-study-guide.html'
                            target='_blank'
                            rel='noreferrer'
                            colorScheme='teal'
                            variant='outline'
                        >
                            Study Guide ↗
                        </Button>
                        <Button
                            as='a'
                            href='/docs/italian-drivers-license-study-guide.html'
                            download='italian-drivers-license-study-guide.html'
                            colorScheme='teal'
                            variant='solid'
                        >
                            Download Guide
                        </Button>
                    </Stack>
                </Flex>
                <Box as='main' className='app-main'>
                    <QuizPage />
                </Box>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
