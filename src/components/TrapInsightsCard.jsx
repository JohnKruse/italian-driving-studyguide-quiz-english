import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Link,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { FiExternalLink, FiRepeat } from 'react-icons/fi';
import {
  getCueMeta,
  getQuestionById,
  getTrickMeta,
  loadQuestionDetails,
} from '../services/get-analytics';

function formatTagLabel(tag) {
  return String(tag || '').replace(/_/g, ' ');
}

function TrapInsightsCard({
  questionId,
  chapterId,
  image,
  answer,
  userAnswer,
  details: initialDetails = null,
}) {
  const [details, setDetails] = useState(initialDetails);
  const [showTwin, setShowTwin] = useState(false);
  const [twinEn, setTwinEn] = useState(null);

  const trickMeta = getTrickMeta(questionId);
  const twinQuestion = details?.opp_id ? getQuestionById(details.opp_id) : null;

  useEffect(() => {
    setShowTwin(false);
    setTwinEn(null);
    if (initialDetails) {
      setDetails(initialDetails);
      return undefined;
    }

    let active = true;
    loadQuestionDetails(questionId, chapterId).then((loaded) => {
      if (active) {
        setDetails(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [questionId, chapterId, initialDetails]);

  useEffect(() => {
    if (!showTwin || !twinQuestion) {
      return undefined;
    }
    let active = true;
    loadQuestionDetails(twinQuestion.id, twinQuestion.id_chapter).then((loaded) => {
      if (active && loaded?.question_en) {
        setTwinEn(loaded.question_en);
      }
    });
    return () => {
      active = false;
    };
  }, [showTwin, twinQuestion]);

  const isCorrect = userAnswer === answer;
  const score = details?.score ?? trickMeta?.score ?? null;
  const antiHeuristic = details?.anti_heuristic ?? trickMeta?.antiHeuristic ?? false;
  const blindWrong = trickMeta?.blindWrong ?? (details ? !details.blind_correct : false);
  const matchedCues = details?.matched_cues || [];
  const trapTags = (details?.trap_tags || []).filter(
    (tag) => tag && tag !== 'straightforward_rule',
  );

  return (
    <Box
      mt={5}
      p={4}
      borderWidth='1px'
      borderRadius='lg'
      borderColor={isCorrect ? 'green.300' : 'red.300'}
      bg={isCorrect ? 'blackAlpha.50' : 'red.50'}
      _dark={{
        bg: isCorrect ? 'whiteAlpha.50' : 'rgba(254, 178, 178, 0.08)',
        borderColor: isCorrect ? 'green.500' : 'red.400',
      }}
      textAlign='left'
      fontSize='md'
    >
      <Stack spacing={3}>
        <Flex align='center' justify='space-between' wrap='wrap' gap={2}>
          <Flex align='center' wrap='wrap' gap={2}>
            <Badge colorScheme={isCorrect ? 'green' : 'red'} fontSize='0.8em' px={2} py={0.5}>
              {isCorrect ? 'Esatto / Correct' : 'Sbagliato / Incorrect'}
            </Badge>
            <Badge colorScheme={answer === 1 ? 'teal' : 'pink'} fontSize='0.8em' px={2} py={0.5}>
              Official: {answer === 1 ? 'VERO' : 'FALSO'}
            </Badge>
            {score !== null && (
              <Tag size='sm' colorScheme={score >= 50 ? 'orange' : score >= 25 ? 'yellow' : 'gray'}>
                Trick score: {score}/100
              </Tag>
            )}
          </Flex>
          <Flex wrap='wrap' gap={1.5}>
            {trapTags.map((tag) => (
              <Tag key={tag} size='sm' variant='subtle' colorScheme='purple'>
                {formatTagLabel(tag)}
              </Tag>
            ))}
          </Flex>
        </Flex>

        {antiHeuristic && (
          <Alert status='warning' variant='left-accent' borderRadius='md' py={2}>
            <AlertIcon />
            <Box fontSize='sm'>
              <Text fontWeight='bold'>
                Eccezione alla regola / Rule Exception (Anti-Heuristic)
              </Text>
              <Text>
                This question breaks the usual trigger-word pattern (e.g. a keyword leans one way,
                but the official answer is {answer === 1 ? 'VERO' : 'FALSO'}). Memorize this case.
              </Text>
            </Box>
          </Alert>
        )}

        {matchedCues.length > 0 && (
          <Box
            p={3}
            borderRadius='md'
            borderWidth='1px'
            borderColor='teal.200'
            bg='white'
            _dark={{ bg: 'gray.800', borderColor: 'teal.700' }}
          >
            <Text fontSize='xs' fontWeight='bold' textTransform='uppercase' color='teal.600' _dark={{ color: 'teal.300' }} mb={1.5}>
              Pattern / Linguistic Cue
            </Text>
            <Stack spacing={1}>
              {matchedCues.map((cue) => {
                const meta = getCueMeta(cue);
                const anchorHref = meta?.anchor
                  ? `/docs/patente-heuristics-playbook.html#${meta.anchor}`
                  : '/docs/patente-heuristics-playbook.html';
                return (
                  <Flex key={cue} align='center' justify='space-between' wrap='wrap' gap={2} fontSize='sm'>
                    <Text>
                      <strong>&ldquo;{cue}&rdquo;</strong>
                      {meta
                        ? ` → ${meta.bias_pct}% ${meta.direction} (n=${meta.count}${meta.kind === 'myth' ? ', near 50:50 myth' : ''})`
                        : ''}
                    </Text>
                    <Link
                      href={anchorHref}
                      isExternal
                      color='teal.600'
                      _dark={{ color: 'teal.300' }}
                      fontSize='xs'
                      fontWeight='semibold'
                      display='inline-flex'
                      alignItems='center'
                      gap={1}
                    >
                      Playbook <FiExternalLink />
                    </Link>
                  </Flex>
                );
              })}
            </Stack>
          </Box>
        )}

        {details ? (
          <Stack spacing={2} fontSize='sm'>
            <Box>
              <Text fontWeight='semibold' color='gray.800' _dark={{ color: 'gray.100' }}>
                IT: {details.exp_it}
              </Text>
              <Text color='gray.600' _dark={{ color: 'gray.300' }} mt={0.5}>
                EN: {details.exp_en}
              </Text>
            </Box>
            {(details.tip_it || details.tip_en) && (
              <>
                <Divider />
                <Box>
                  <Text fontSize='xs' fontWeight='bold' textTransform='uppercase' color='blue.600' _dark={{ color: 'blue.300' }}>
                    Exam Tip / Consiglio
                  </Text>
                  <Text color='gray.800' _dark={{ color: 'gray.100' }}>
                    IT: {details.tip_it}
                  </Text>
                  <Text color='gray.600' _dark={{ color: 'gray.300' }}>
                    EN: {details.tip_en}
                  </Text>
                </Box>
              </>
            )}
            {Number(image) > 0 && (details.sign_it || details.sign_en) && (
              <Text fontSize='xs' color='gray.600' _dark={{ color: 'gray.400' }}>
                <strong>Figura #{image}:</strong> {details.sign_it}
                {details.sign_en ? ` — ${details.sign_en}` : ''}
                {Number(chapterId) === 14 && blindWrong
                  ? ' (Intersection diagram: verify trajectories directly on the figure.)'
                  : ''}
              </Text>
            )}
          </Stack>
        ) : (
          <Text fontSize='sm' color='gray.500'>
            Detailed heuristic notes unavailable for this question.
          </Text>
        )}

        {twinQuestion && (
          <Box>
            <Button
              size='xs'
              variant='outline'
              colorScheme='teal'
              leftIcon={<FiRepeat />}
              onClick={() => setShowTwin((prev) => !prev)}
            >
              {showTwin ? 'Hide' : 'Compare'} Opposite Twin (#{twinQuestion.id} —{' '}
              {twinQuestion.answer === 1 ? 'VERO' : 'FALSO'})
            </Button>
            <Collapse in={showTwin} animateOpacity>
              <Box
                mt={2}
                p={3}
                borderRadius='md'
                borderWidth='1px'
                borderColor='gray.200'
                bg='white'
                _dark={{ bg: 'gray.800', borderColor: 'gray.600' }}
                fontSize='sm'
              >
                <Flex align='center' gap={2} mb={1}>
                  <Badge colorScheme={twinQuestion.answer === 1 ? 'green' : 'red'}>
                    Twin #{twinQuestion.id}: {twinQuestion.answer === 1 ? 'VERO' : 'FALSO'}
                  </Badge>
                </Flex>
                <Text fontWeight='medium'>{twinQuestion.question}</Text>
                {twinEn && (
                  <Text color='gray.600' _dark={{ color: 'gray.300' }} mt={1}>
                    {twinEn}
                  </Text>
                )}
              </Box>
            </Collapse>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

TrapInsightsCard.propTypes = {
  questionId: PropTypes.number.isRequired,
  chapterId: PropTypes.number.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  answer: PropTypes.number.isRequired,
  userAnswer: PropTypes.number.isRequired,
  details: PropTypes.shape({
    question_en: PropTypes.string,
    matched_cues: PropTypes.arrayOf(PropTypes.string),
    anti_heuristic: PropTypes.bool,
    score: PropTypes.number,
    tier: PropTypes.string,
    trap_tags: PropTypes.arrayOf(PropTypes.string),
    human_risk: PropTypes.string,
    blind_correct: PropTypes.bool,
    exp_it: PropTypes.string,
    exp_en: PropTypes.string,
    tip_it: PropTypes.string,
    tip_en: PropTypes.string,
    opp_id: PropTypes.number,
    sign_it: PropTypes.string,
    sign_en: PropTypes.string,
  }),
};

export default TrapInsightsCard;
