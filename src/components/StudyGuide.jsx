import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Select,
    Stack,
    Text,
} from '@chakra-ui/react';
import guideMarkdown from '../../docs/italian-drivers-license-study-guide.md?raw';

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

function getTextContent(node) {
    if (Array.isArray(node)) {
        return node.map((child) => getTextContent(child)).join('');
    }

    if (typeof node === 'string') {
        return node;
    }

    if (!node || !node.props || !node.props.children) {
        return '';
    }

    return React.Children.toArray(node.props.children)
        .map((child) => getTextContent(child))
        .join('');
}

function normalizeImageSource(src) {
    if (!src) {
        return src;
    }

    if (src.startsWith('../public/')) {
        return src.replace('../public', '');
    }

    if (src.startsWith('../docs/')) {
        return src.replace('../docs', '/docs');
    }

    if (src.startsWith('assets/')) {
        return `/docs-assets/${src.slice('assets/'.length)}`;
    }

    return src;
}

function parseGuide(markdown) {
    const lines = markdown.split('\n');
    const title = lines[0].replace(/^#\s+/, '').trim();
    const sections = [];
    let currentSection = null;

    for (const line of lines.slice(1)) {
        const headingMatch = line.match(/^##\s+(.*)$/);
        if (headingMatch) {
            if (currentSection) {
                sections.push(currentSection);
            }

            const heading = headingMatch[1].trim();
            currentSection = {
                title: heading,
                slug: slugify(heading),
                markdown: `## ${heading}\n`,
            };
            continue;
        }

        if (currentSection) {
            currentSection.markdown += `${line}\n`;
        }
    }

    if (currentSection) {
        sections.push(currentSection);
    }

    const filteredSections = sections.filter((section) =>
        section.title !== 'Table Of Contents' && section.title !== 'Next Chapters To Draft'
    );

    return { title, sections: filteredSections };
}

function getSectionFromUrl(defaultSection) {
    const params = new URLSearchParams(window.location.search);
    return params.get('section') || defaultSection;
}

function updateSectionInUrl(sectionId, replace = false) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'guide');
    url.searchParams.set('section', sectionId);

    if (replace) {
        window.history.replaceState({}, '', url);
        return;
    }

    window.history.pushState({}, '', url);
}

function StudyGuide() {
    const parsedGuide = useMemo(() => parseGuide(guideMarkdown), []);
    const [activeSection, setActiveSection] = useState(
        getSectionFromUrl(parsedGuide.sections[0]?.slug)
    );
    const sectionRefs = useRef({});

    useEffect(() => {
        function onPopState() {
            setActiveSection(getSectionFromUrl(parsedGuide.sections[0]?.slug));
        }

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [parsedGuide.sections]);

    useEffect(() => {
        const sectionId = getSectionFromUrl(parsedGuide.sections[0]?.slug);
        if (!sectionId) {
            return;
        }

        const target = sectionRefs.current[sectionId];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [parsedGuide.sections]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

                if (!visibleEntry) {
                    return;
                }

                const nextSection = visibleEntry.target.getAttribute('id');
                if (nextSection && nextSection !== activeSection) {
                    setActiveSection(nextSection);
                    updateSectionInUrl(nextSection, true);
                }
            },
            {
                rootMargin: '-20% 0px -60% 0px',
                threshold: [0.1, 0.3, 0.6],
            }
        );

        const currentRefs = Object.values(sectionRefs.current);
        currentRefs.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [activeSection, parsedGuide.sections]);

    function jumpToSection(sectionId) {
        const target = sectionRefs.current[sectionId];
        if (!target) {
            return;
        }

        setActiveSection(sectionId);
        updateSectionInUrl(sectionId);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const markdownComponents = {
        h2({ children }) {
            return (
                <Heading as='h2' size='xl' mt={0} mb={6}>
                    {children}
                </Heading>
            );
        },
        h3({ children }) {
            const label = getTextContent(children);
            return (
                <Heading as='h3' size='md' mt={8} mb={3} id={slugify(label)}>
                    {children}
                </Heading>
            );
        },
        p({ children }) {
            return (
                <Text color='gray.700' lineHeight='tall' mb={4}>
                    {children}
                </Text>
            );
        },
        ul({ children }) {
            return (
                <Box as='ul' pl={6} mb={4} className='study-guide-list'>
                    {children}
                </Box>
            );
        },
        ol({ children }) {
            return (
                <Box as='ol' pl={6} mb={4} className='study-guide-list'>
                    {children}
                </Box>
            );
        },
        li({ children }) {
            return (
                <Box as='li' color='gray.700' lineHeight='tall' mb={2}>
                    {children}
                </Box>
            );
        },
        table({ children }) {
            return (
                <Box className='study-guide-table-wrap'>
                    <table className='study-guide-table'>{children}</table>
                </Box>
            );
        },
        img({ src, alt }) {
            return (
                <Box
                    as='img'
                    alt={alt}
                    className='study-guide-image'
                    loading='lazy'
                    src={normalizeImageSource(src)}
                />
            );
        },
        a({ href, children }) {
            if (href?.startsWith('#')) {
                const sectionId = href.replace(/^#/, '');
                return (
                    <a
                        href={`?view=guide&section=${sectionId}`}
                        onClick={(event) => {
                            event.preventDefault();
                            jumpToSection(sectionId);
                        }}
                    >
                        {children}
                    </a>
                );
            }

            return (
                <a href={href} rel='noreferrer' target='_blank'>
                    {children}
                </a>
            );
        },
    };

    return (
        <Flex align='flex-start' className='study-guide-layout' gap={8}>
            <Box
                as='aside'
                className='study-guide-sidebar'
                display={{ base: 'none', lg: 'block' }}
            >
                <Box className='study-guide-sidebar-inner'>
                    <Text className='study-guide-sidebar-label'>Guide Navigation</Text>
                    <Heading as='h2' size='md' mb={4}>
                        {parsedGuide.title}
                    </Heading>
                    <Stack spacing={2}>
                        {parsedGuide.sections.map((section) => (
                            <Button
                                key={section.slug}
                                justifyContent='flex-start'
                                onClick={() => jumpToSection(section.slug)}
                                variant={section.slug === activeSection ? 'solid' : 'ghost'}
                                colorScheme={section.slug === activeSection ? 'teal' : 'gray'}
                                whiteSpace='normal'
                            >
                                {section.title}
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Box>
            <Box className='study-guide-content'>
                <Box display={{ base: 'block', lg: 'none' }} mb={6}>
                    <Text fontSize='sm' fontWeight='semibold' mb={2} textTransform='uppercase'>
                        Jump To Section
                    </Text>
                    <Select
                        onChange={(event) => jumpToSection(event.target.value)}
                        value={activeSection}
                    >
                        {parsedGuide.sections.map((section) => (
                            <option key={section.slug} value={section.slug}>
                                {section.title}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Box className='study-guide-hero'>
                    <Text className='study-guide-eyebrow'>English Study Draft</Text>
                    <Heading as='h1' size='2xl' mb={4}>
                        {parsedGuide.title}
                    </Heading>
                    <Text color='gray.700' fontSize='lg' maxW='4xl'>
                        The guide now lives as a browsable HTML view generated from the Markdown
                        source, so navigation and future edits stay in one place.
                    </Text>
                </Box>

                <Divider mb={8} />

                <Stack spacing={10}>
                    {parsedGuide.sections.map((section) => (
                        <Box
                            key={section.slug}
                            className='study-guide-section'
                            id={section.slug}
                            ref={(element) => {
                                sectionRefs.current[section.slug] = element;
                            }}
                        >
                            <ReactMarkdown
                                components={markdownComponents}
                                remarkPlugins={[remarkGfm]}
                            >
                                {section.markdown}
                            </ReactMarkdown>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Flex>
    );
}

export default StudyGuide;
