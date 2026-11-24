import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import Hint from '../Hint/Hint';
import Figura from '../Figura/Figura';
import TrapInsightsCard from '../TrapInsightsCard';
import {
  getTrickMeta,
  loadQuestionDetails,
} from '../../services/get-analytics';
import {
  REVIEW_MODE_ALWAYS,
  REVIEW_MODE_WRONG_ONLY,
  shouldShowReasoningAfterAnswer,
} from '../../services/review-mode';

function Domanda({
  id,
  id_chapter,
  argomento,
  argomento_en = '',
  image = '',
  question,
  answer,
  theory,
  totali,
  errate,
  progress = null,
  isMock = false,
  showTrapIcon = true,
  langMode = 'peek',
  reviewMode = REVIEW_MODE_ALWAYS,
  onSuccess,
  onError,
  onMockSubmit = null,
}) {
  const toast = useToast();
  const [answeredChoice, setAnsweredChoice] = useState(null);
  const [peekEn, setPeekEn] = useState(false);
  const [details, setDetails] = useState(null);

  const trickMeta = getTrickMeta(id);
  const isFlipped = !isMock && answeredChoice !== null;
  const showTrapBadge = !isMock && showTrapIcon && trickMeta?.tier === 'trap';

  useEffect(() => {
    setAnsweredChoice(null);
    setPeekEn(false);
    setDetails(null);

    let active = true;
    loadQuestionDetails(id, id_chapter).then((loaded) => {
      if (active) {
        setDetails(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [id, id_chapter]);

  const submitAnswer = useCallback(
    (value) => {
      if (isMock) {
        onMockSubmit?.(value);
        return;
      }
      if (answeredChoice !== null) {
        return;
      }
      const isCorrect = answer === value;
      if (!shouldShowReasoningAfterAnswer({ isMock, reviewMode, isCorrect })) {
        toast({
          title: 'Correct — Esatto',
          status: 'success',
          duration: 800,
          position: 'top',
        });
        onSuccess();
        return;
      }
      setAnsweredChoice(value);
      if (!isCorrect) {
        onError(id);
      }
    },
    [
      answer,
      answeredChoice,
      id,
      isMock,
      onError,
      onMockSubmit,
      onSuccess,
      reviewMode,
      toast,
    ],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        return;
      }
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      const key = event.key.toLowerCase();
      if (isFlipped && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onSuccess();
        return;
      }
      if (!isFlipped && (key === 'f' || key === '0')) {
        event.preventDefault();
        submitAnswer(0);
        return;
      }
      if (!isFlipped && (key === 'v' || key === '1')) {
        event.preventDefault();
        submitAnswer(1);
        return;
      }
      if (key === 't') {
        event.preventDefault();
        setPeekEn((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onSuccess, submitAnswer]);

  const showEnQuestion = Boolean(
    details?.question_en &&
      (langMode === 'it-en' ||
        (langMode === 'peek' && (peekEn || isFlipped)) ||
        (langMode === 'it' && peekEn)),
  );
  const showPeekControl = Boolean(
    details?.question_en &&
      ((langMode === 'peek' && !isFlipped) || (langMode === 'it' && isFlipped)),
  );

  return (
    <Container w='full' maxW='3xl'>
      {progress && (
        <Text fontSize='md' marginBottom={1}>
          Question {progress.current} / {progress.total}
        </Text>
      )}
      <Text fontSize='2xl' marginBottom={2}>
        <strong>{totali}</strong> domande | <strong>{errate}</strong> errate
      </Text>
      <Center marginBottom={2}>
        <Text fontSize='md' display='inline-flex' alignItems='center' gap={2}>
          <span>Domanda: {id}</span>
          {showTrapBadge && (
            <Badge
              colorScheme='orange'
              variant='subtle'
              display='inline-flex'
              alignItems='center'
              gap={1}
              px={2}
              py={0.5}
              borderRadius='md'
            >
              <FiAlertTriangle />
              Trap
            </Badge>
          )}
        </Text>
      </Center>

      <Heading as='h2' size='md' marginBottom={argomento_en && langMode !== 'it' ? 1 : 3}>
        {id_chapter}. {argomento}
      </Heading>
      {argomento_en && langMode !== 'it' && (
        <Text fontSize='sm' color='gray.500' _dark={{ color: 'gray.400' }} marginBottom={3}>
          {argomento_en}
        </Text>
      )}

      <Figura image={image} marginBottom={5} />

      <Text fontSize='2xl' fontWeight='medium'>
        {question}
      </Text>

      {showEnQuestion && (
        <Text
          fontSize='md'
          color='gray.600'
          _dark={{ color: 'gray.300' }}
          mt={2}
        >
          {details.question_en}
        </Text>
      )}

      {showPeekControl && (
        <Center mt={2}>
          <Button
            size='xs'
            variant='ghost'
            colorScheme='teal'
            leftIcon={peekEn ? <FiEyeOff /> : <FiEye />}
            onClick={() => setPeekEn((prev) => !prev)}
          >
            {peekEn ? 'Hide EN (T)' : 'Show EN (T)'}
          </Button>
        </Center>
      )}

      <Center marginTop={8} marginBottom={4}>
        <Stack direction='row' spacing={4}>
          <Button
            colorScheme='red'
            size='lg'
            variant={
              isFlipped
                ? answer === 0 || answeredChoice === 0
                  ? 'solid'
                  : 'outline'
                : 'solid'
            }
            opacity={isFlipped && answer !== 0 && answeredChoice !== 0 ? 0.45 : 1}
            isDisabled={isFlipped}
            onClick={() => submitAnswer(0)}
          >
            Falso {answeredChoice === 0 ? (answer === 0 ? '✓' : '✕') : ''}
          </Button>
          <Button
            colorScheme='green'
            size='lg'
            variant={
              isFlipped
                ? answer === 1 || answeredChoice === 1
                  ? 'solid'
                  : 'outline'
                : 'solid'
            }
            opacity={isFlipped && answer !== 1 && answeredChoice !== 1 ? 0.45 : 1}
            isDisabled={isFlipped}
            onClick={() => submitAnswer(1)}
          >
            Vero {answeredChoice === 1 ? (answer === 1 ? '✓' : '✕') : ''}
          </Button>
          {isFlipped && (
            <Button
              colorScheme='teal'
              size='lg'
              rightIcon={<FiArrowRight />}
              onClick={onSuccess}
            >
              Prossima / Next
            </Button>
          )}
        </Stack>
      </Center>

      <Center mb={3}>
        <Hint theory={theory} />
      </Center>

      {isFlipped && (
        <Box pb={6}>
          <TrapInsightsCard
            questionId={id}
            chapterId={id_chapter}
            image={image}
            answer={answer}
            userAnswer={answeredChoice}
            details={details}
          />
        </Box>
      )}
    </Container>
  );
}

Domanda.propTypes = {
  id: PropTypes.number.isRequired,
  id_chapter: PropTypes.number.isRequired,
  theory: PropTypes.number.isRequired,
  argomento: PropTypes.string.isRequired,
  argomento_en: PropTypes.string,
  image: PropTypes.string,
  question: PropTypes.string.isRequired,
  answer: PropTypes.number.isRequired,
  totali: PropTypes.number.isRequired,
  errate: PropTypes.number.isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }),
  isMock: PropTypes.bool,
  showTrapIcon: PropTypes.bool,
  langMode: PropTypes.oneOf(['it', 'peek', 'it-en']),
  reviewMode: PropTypes.oneOf([REVIEW_MODE_ALWAYS, REVIEW_MODE_WRONG_ONLY]),
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onMockSubmit: PropTypes.func,
};

export default Domanda;
