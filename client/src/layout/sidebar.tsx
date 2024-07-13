import {
    Box,
    Collapse,
    Group,
    ScrollArea,
    Text,
    ThemeIcon,
    UnstyledButton,
    rem,
} from '@mantine/core'
import { IconChevronRight, IconSubtask } from '@tabler/icons-react'
import { useState } from 'react'
import './sidebar.scss'
import { Link } from '@tanstack/react-router'

const sideBarNavItems = [
    {
        label: 'Topics',
        icon: IconSubtask,
        links: [
            { label: 'Create', link: '/topics/create' },
            { label: 'List', link: '/' },
        ],
    },
]

export function Sidebar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const links = sideBarNavItems.map((item) => (
        <LinksGroup {...item} key={item.label} toggleSidebar={toggleSidebar} />
    ))

    return (
        <nav className={'sidebar'}>
            <ScrollArea className={'links'}>
                <div className={'linksInner'}>{links}</div>
            </ScrollArea>

            <div className={'footer'} />
        </nav>
    )
}

export function LinksGroup({
    icon: Icon,
    label,
    initiallyOpened,
    links,
    toggleSidebar,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.FC<any>
    label: string
    initiallyOpened?: boolean
    links?: { label: string; link: string }[]
    toggleSidebar: () => void
}) {
    const hasLinks = Array.isArray(links)
    const [opened, setOpened] = useState(initiallyOpened || false)
    const items = (hasLinks ? links : []).map((link) => (
        <Text className={'link-item'} key={link.label}>
            <Link to={link.link} onClick={toggleSidebar}>
                {link.label}
            </Link>
        </Text>
    ))

    return (
        <Box className="link-group">
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={'link'}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
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
