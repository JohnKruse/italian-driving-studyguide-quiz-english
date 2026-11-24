import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import { ColorModeSwitcher } from '../ColorModeSwitcher.jsx';
import Domanda from './Domanda';
import TrapInsightsCard from './TrapInsightsCard';
import pickDomanda, { countMatchingDomande } from '../services/pick-domanda';
import { loadQuestionDetails } from '../services/get-analytics';
import ArgomentoPicker from './ArgomentoPicker';
import buildMockTest from '../services/build-mock-test';
import { MOCK_TEST_VALUE } from '../constants/mock-test';

const PREFS_KEYS = {
  showTrapIcon: 'patente.showTrapIcon',
  langMode: 'patente.langMode',
};

function readStoredBool(key, fallback) {
  try {
    const val = window.localStorage.getItem(key);
    if (val === null) return fallback;
    return val === 'true';
  } catch {
    return fallback;
  }
}

function readStoredLangMode(fallback = 'peek') {
  try {
    const val = window.localStorage.getItem(PREFS_KEYS.langMode);
    if (val === 'it' || val === 'peek' || val === 'it-en') {
      return val;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function MockMissedQuestionItem({ item }) {
  const { domanda, userAnswer } = item;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let active = true;
    loadQuestionDetails(domanda.id, domanda.id_chapter).then((loaded) => {
      if (active) {
        setDetails(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [domanda.id, domanda.id_chapter]);

  return (
    <Box
      p={4}
      borderWidth='1px'
      borderRadius='lg'
      textAlign='left'
      w='full'
    >
      <Text fontSize='sm' color='gray.500' mb={1}>
        Domanda #{domanda.id} — Ch {domanda.id_chapter}. {domanda.argomento} | Your answer:{' '}
        <strong>{userAnswer === 1 ? 'VERO' : 'FALSO'}</strong>
      </Text>
      <Text fontSize='lg' fontWeight='semibold'>
        {domanda.question}
      </Text>
      {details?.question_en && (
        <Text fontSize='md' color='gray.600' _dark={{ color: 'gray.300' }} mt={1}>
          {details.question_en}
        </Text>
      )}
      <TrapInsightsCard
        questionId={domanda.id}
        chapterId={domanda.id_chapter}
        image={domanda.image}
        answer={domanda.answer}
        userAnswer={userAnswer}
        details={details}
      />
    </Box>
  );
}

function QuizPage() {
  const toast = useToast();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mode, setMode] = useState('practice');
  const [trapsOnly, setTrapsOnly] = useState(false);
  const [showTrapIcon, setShowTrapIcon] = useState(() =>
    readStoredBool(PREFS_KEYS.showTrapIcon, true),
  );
  const [langMode, setLangMode] = useState(() => readStoredLangMode('peek'));

  const [domanda, setDomanda] = useState(() => pickDomanda());
  const [mockQueue, setMockQueue] = useState([]);
  const [mockIndex, setMockIndex] = useState(0);
  const [missedMockItems, setMissedMockItems] = useState([]);
  const [errate, setErrate] = useState([]);
  const [totali, setTotali] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const trapsInScope = countMatchingDomande(selectedChapter, { trapsOnly: true });

  function updateShowTrapIcon(checked) {
    setShowTrapIcon(checked);
    try {
      window.localStorage.setItem(PREFS_KEYS.showTrapIcon, String(checked));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }

  function updateLangMode(nextMode) {
    setLangMode(nextMode);
    try {
      window.localStorage.setItem(PREFS_KEYS.langMode, nextMode);
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }

  function resetTracking() {
    setErrate([]);
    setMissedMockItems([]);
    setTotali(0);
  }

  function loadNextPracticeQuestion(chapter = selectedChapter, nextTrapsOnly = trapsOnly) {
    const picked = pickDomanda(chapter, { trapsOnly: nextTrapsOnly });
    if (!picked && nextTrapsOnly) {
      toast({
        title: 'No trap questions in this chapter',
        description: 'Showing all questions in the selected chapter instead.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setTrapsOnly(false);
      setDomanda(pickDomanda(chapter, { trapsOnly: false }));
      return;
    }
    setDomanda(picked);
  }

  function getNewDomanda() {
    setTotali((current) => current + 1);
    loadNextPracticeQuestion(selectedChapter, trapsOnly);
  }

  function addErrate(id) {
    if (errate.includes(id)) {
      return;
    }
    setErrate((current) => [...current, id]);
  }

  function handleMockSubmit(chosenValue) {
    const current = mockQueue[mockIndex];
    if (!current) {
      return;
    }
    if (chosenValue !== current.answer) {
      addErrate(current.id);
      setMissedMockItems((prev) => [...prev, { domanda: current, userAnswer: chosenValue }]);
    }
    const nextIndex = mockIndex + 1;
    setMockIndex(nextIndex);
    setDomanda(nextIndex < mockQueue.length ? mockQueue[nextIndex] : null);
  }

  function exitMockTest() {
    setMode('practice');
    setMockQueue([]);
    setMockIndex(0);
    setSelectedChapter(null);
    resetTracking();
    loadNextPracticeQuestion(null, trapsOnly);
  }

  function startMockTest() {
    setIsLoading(true);
    try {
      const questions = buildMockTest();
      if (!questions.length) {
        throw new Error('No questions available for the mock test.');
      }
      setMode('mock');
      setMockQueue(questions);
      setMockIndex(0);
      resetTracking();
      setSelectedChapter(null);
      setDomanda(questions[0]);
    } catch (error) {
      toast({
        title: 'Unable to start mock test',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      exitMockTest();
    } finally {
      setIsLoading(false);
    }
  }

  function onChangeArgomento(value) {
    if (value === MOCK_TEST_VALUE) {
      startMockTest();
      return;
    }

    const chapterId = value === '' ? null : Number(value);
    setMode('practice');
    setMockQueue([]);
    setMockIndex(0);
    setSelectedChapter(chapterId);
    resetTracking();
    loadNextPracticeQuestion(chapterId, trapsOnly);
  }

  function toggleTrapsOnly() {
    const nextVal = !trapsOnly;
    if (nextVal && trapsInScope === 0) {
      toast({
        title: 'No trap questions in this chapter',
        description: 'Select another chapter or All Topics to drill traps.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setTrapsOnly(nextVal);
    loadNextPracticeQuestion(selectedChapter, nextVal);
  }

  const isMock = mode === 'mock';
  const mockCompleted = isMock && mockQueue.length > 0 && mockIndex >= mockQueue.length;
  const selectValue = isMock ? MOCK_TEST_VALUE : selectedChapter ?? '';
  const progress =
    isMock && !mockCompleted && mockQueue.length > 0
      ? { current: mockIndex + 1, total: mockQueue.length }
      : null;
  const displayedTotali = isMock ? mockIndex : totali;
  const mockPassed = errate.length <= 3;

  return (
    <>
      <Flex p={2} gap={3} align='center' wrap='wrap'>
        <Box minW={{ base: 'full', md: '20rem' }}>
          <ArgomentoPicker
            onChange={onChangeArgomento}
            value={selectValue}
            includeMockOption
          />
        </Box>

        {!isMock && (
          <Stack direction='row' spacing={3} align='center' wrap='wrap'>
            <Button
              size='sm'
              colorScheme={trapsOnly ? 'orange' : 'gray'}
              variant={trapsOnly ? 'solid' : 'outline'}
              leftIcon={<FiAlertTriangle />}
              isDisabled={!trapsOnly && trapsInScope === 0}
              onClick={toggleTrapsOnly}
            >
              Traps only ({trapsInScope})
            </Button>

            <FormControl display='flex' alignItems='center' w='auto'>
              <FormLabel htmlFor='trap-icon-toggle' mb={0} mr={2} fontSize='sm'>
                Trap icon
              </FormLabel>
              <Switch
                id='trap-icon-toggle'
                colorScheme='orange'
                size='sm'
                isChecked={showTrapIcon}
                onChange={(event) => updateShowTrapIcon(event.target.checked)}
              />
            </FormControl>
          </Stack>
        )}

        <ButtonGroup size='sm' isAttached variant='outline' colorScheme='teal'>
          <Button
            variant={langMode === 'it' ? 'solid' : 'outline'}
            onClick={() => updateLangMode('it')}
          >
            IT
          </Button>
          <Button
            variant={langMode === 'peek' ? 'solid' : 'outline'}
            onClick={() => updateLangMode('peek')}
          >
            Peek
          </Button>
          <Button
            variant={langMode === 'it-en' ? 'solid' : 'outline'}
            onClick={() => updateLangMode('it-en')}
          >
            IT + EN
          </Button>
        </ButtonGroup>

        <Spacer />
        <Box>
          <ColorModeSwitcher justifySelf='flex-end' />
        </Box>
      </Flex>

      <Box textAlign='center' fontSize='xl'>
        <Grid minH={500} p={3}>
          {isLoading && <Spinner />}
          {!isLoading && mockCompleted && (
            <Stack spacing={5} align='center' maxW='3xl' mx='auto' w='full'>
              <Heading as='h2' size='lg'>
                Mock test completed!
              </Heading>
              <Badge
                colorScheme={mockPassed ? 'green' : 'red'}
                fontSize='md'
                px={3}
                py={1}
                borderRadius='md'
              >
                {mockPassed
                  ? 'PASSED (Idoneo — max 3 errors allowed)'
                  : 'NOT PASSED (Non idoneo — over 3 errors)'}
              </Badge>
              <Text fontSize='lg'>
                Correct: <strong>{mockQueue.length - errate.length} / {mockQueue.length}</strong> | Errors:{' '}
                <strong>{errate.length}</strong>
              </Text>
              <Stack direction='row' spacing={4}>
                <Button colorScheme='teal' onClick={startMockTest}>
                  Restart mock test
                </Button>
                <Button variant='outline' onClick={exitMockTest}>
                  Return to practice
                </Button>
              </Stack>

              {missedMockItems.length > 0 && (
                <Stack spacing={4} w='full' mt={4}>
                  <Heading as='h3' size='md' textAlign='left'>
                    Missed Questions Review ({missedMockItems.length})
                  </Heading>
                  {missedMockItems.map((item) => (
                    <MockMissedQuestionItem key={item.domanda.id} item={item} />
                  ))}
                </Stack>
              )}
            </Stack>
          )}
          {!isLoading && !mockCompleted && domanda ? (
            <Domanda
              totali={displayedTotali}
              errate={errate.length}
              progress={progress}
              {...domanda}
              isMock={isMock}
              showTrapIcon={!isMock && showTrapIcon}
              langMode={langMode}
              onSuccess={getNewDomanda}
              onError={addErrate}
              onMockSubmit={handleMockSubmit}
            />
          ) : (
            !isLoading && !mockCompleted && <Spinner />
          )}
        </Grid>
      </Box>
    </>
  );
}

export default QuizPage;
