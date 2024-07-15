import {
    Box,
    Collapse,
    Group,
    ScrollArea,
    ThemeIcon,
    UnstyledButton,
    rem,
} from '@mantine/core'
import {
    IconChevronRight,
    IconList,
    IconMathGreater,
    IconPlus,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { TextElement } from 'src/components/basic'
import './sidebar.scss'

const iconSize = { width: rem(18), height: rem(18) }

const sideBarNavItems = [
    {
        label: 'Topics',
        icon: <IconMathGreater style={iconSize} />,
        links: [
            {
                label: 'Create',
                link: '/topics/create',
                icon: <IconPlus style={iconSize} />,
            },
            { label: 'List', link: '/', icon: <IconList style={iconSize} /> },
        ],
    },
]

export function Sidebar({
    toggleSidebar,
    width,
}: {
    width: number
    toggleSidebar: () => void
}) {
    const links = sideBarNavItems.map((item) => (
        <LinksGroup
            {...item}
            key={item.label}
            icon={item.icon}
            toggleSidebar={toggleSidebar}
        />
    ))

    return (
        <nav className={'sidebar'} style={{ width }}>
            <ScrollArea className={'links'}>
                <div className={'linksInner'}>{links}</div>
            </ScrollArea>

            <div className={'footer'} />
        </nav>
    )
}

export function LinksGroup({
    icon,
    label,
    initiallyOpened,
    links,
    toggleSidebar,
}: {
    icon: JSX.Element
    label: string
    initiallyOpened?: boolean
    links?: { label: string; link: string; icon: JSX.Element }[]
    toggleSidebar: () => void
}) {
    const hasLinks = Array.isArray(links)
    const [opened, setOpened] = useState(initiallyOpened || false)
    const items = (hasLinks ? links : []).map((link) => (
        <TextElement className={'link-item'} key={link.label}>
            <Link
                to={link.link}
                onClick={toggleSidebar}
                className="flex items-center gap-2"
            >
                <ThemeIcon variant="light" size={30}>
                    {link.icon}
                </ThemeIcon>
                <TextElement fw={500}>{link.label}</TextElement>
            </Link>
        </TextElement>
    ))

    return (
        <Box className="link-group">
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={'link'}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30}>
                            {/* <Icon style={{ width: rem(18), height: rem(18) }} /> */}
                            {icon}
                        </ThemeIcon>
                        <TextElement ml="md" fw={500}>
                            {label}
                        </TextElement>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={'chevron'}
                            stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(-90deg)' : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </Box>
    )
}
