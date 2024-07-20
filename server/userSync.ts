import { clerkClient } from '@clerk/clerk-sdk-node'
import { UserDbSchema, UsersSchema } from '@project-planner/shared-schema'
import { dbClient } from './db-client'
import { buildConflictUpdateColumns } from './utils'

async function synchronizeUsers() {
    console.log('Synchronizing users...')

    const userCount = await clerkClient.users.getCount()
    // fetch users in batches of 100 until all users are fetched

    let offset = 0
    const limit = 100

    const userList = []

    while (offset < userCount) {
        const users = await clerkClient.users.getUserList({ limit, offset })

        for (const user of users.data) {
            userList.push({
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                banned: user.banned,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
            })
        }

        offset += limit
    }

    // synchronize users with the database
    const users = userList.map((x) => UsersSchema.parse(x))

    await dbClient
        .insert(UserDbSchema.usersTable)
        .values(users)
        .onConflictDoUpdate({
            target: UserDbSchema.usersTable.id,
            set: buildConflictUpdateColumns(UserDbSchema.usersTable, [
                'email',
                'banned',
                'firstName',
                'lastName',
                'fullName',
                'updatedAt',
            ]),
        })

    console.log('Synchronized users completed')
}

setInterval(
    () => {
        try {
            synchronizeUsers()
        } catch (err) {
            console.error('Error synchronizing users', err)
        }
    },
    1000 * 10 * 5,
) // every 5 minutes
