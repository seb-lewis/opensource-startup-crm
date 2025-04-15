import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma'

export async function load({ cookies, locals }) {
    const user = locals.user;
    
    if (!user) {
        return { orgs: [] };
    }
    
    // Fetch organizations associated with this user
    const userOrgs = await prisma.userOrganization.findMany({
        where: {
            userId: user.id
        },
        include: {
            organization: true
        }
    });
    
    // Extract the organization data
    const orgs = userOrgs.map(userOrg => ({
        id: userOrg.organization.id,
        name: userOrg.organization.name,
        logo: userOrg.organization.logo,
        role: userOrg.role,
        isPrimary: userOrg.isPrimary
    }));
    
    return { orgs };
}
