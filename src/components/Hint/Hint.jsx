import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import getHint from '../../services/get-hint';
import { loadHintTranslation } from '../../services/get-analytics';

function splitHintLines(text, isHtml = false) {
  const raw = String(text || '').trim();
  if (!raw) {
    return [];
  }
  const normalized = isHtml
    ? raw.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    : raw;
  return normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function Hint({ theory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState({});
  const [hintEn, setHintEn] = useState(null);

  useEffect(() => {
    setHint(getHint(theory));
  }, [theory]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    let active = true;
    loadHintTranslation(theory).then((loaded) => {
      if (active) {
        setHintEn(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [isOpen, theory]);

  const itLines = splitHintLines(hint.description, true);
  const enLines = splitHintLines(hintEn?.description_en, false);

  return (
    <>
      <Button size='sm' variant='outline' onClick={() => setIsOpen(true)}>
        Mostra suggerimento / Hint
      </Button>
      <Modal size='xl' isOpen={isOpen} onClose={() => setIsOpen(false)} scrollBehavior='inside'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Suggerimento / Theory Hint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <Heading as='h2' size='md' mb={2}>
                  {hint?.title || 'Regola'}
                </Heading>
                {itLines.length > 0 ? (
                  <Stack spacing={1.5}>
                    {itLines.map((line, index) => (
                      <Text key={`it-${index}`} fontSize='md'>
                        {line}
                      </Text>
                    ))}
                  </Stack>
                ) : (
                  <Text color='gray.500'>Suggerimento mancante</Text>
                )}
              </Box>

              {hintEn && (
                <>
                  <Divider />
                  <Box>
                    {hintEn.title_en && (
                      <Heading as='h3' size='sm' color='teal.700' _dark={{ color: 'teal.300' }} mb={2}>
                        {hintEn.title_en}
                      </Heading>
                    )}
                    <Stack spacing={1.5}>
                      {enLines.map((line, index) => (
                        <Text key={`en-${index}`} fontSize='md' color='gray.700' _dark={{ color: 'gray.200' }}>
                          {line}
                        </Text>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={() => setIsOpen(false)}>
              Chiudi / Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

Hint.propTypes = {
  theory: PropTypes.number.isRequired,
};

export default Hint;
