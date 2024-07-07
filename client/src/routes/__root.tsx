import { SignIn, SignOutButton, useUser } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { AppShell, Box, Burger, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from 'src/layout/sidebar';

export const Route = createRootRoute({
    component: () => <AppRoot />,
});

function AppRoot() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'lg',
                collapsed: { mobile: !mobileOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Box className="flex items-center w-full">
                        <Box hiddenFrom="lg" className={'pr-4'}>
                            <Burger
                                opened={mobileOpened}
                                onClick={toggleMobile}
                                hiddenFrom="lg"
                                size="sm"
                            />
                        </Box>
                        <Box className="flex items-center w-full justify-between">
                            <Title order={3}>Project Planner</Title>
                            <Box className="flex items-center pr-4 cursor-pointer">
                                <Auth />
                            </Box>
                        </Box>
                    </Box>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <Sidebar />
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

function Auth() {
    const { isSignedIn } = useUser();
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} withCloseButton={false} radius={'lg'}>
                <SignIn
                    appearance={{
                        baseTheme: dark,
                    }}
                />
            </Modal>
            {isSignedIn ? <SignOutButton /> : <Text onClick={open}>Sign in</Text>}
        </>
    );
}
