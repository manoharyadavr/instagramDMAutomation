import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function getCurrentTenant() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
        return null;
    }

    return {
        tenantId: session.user.tenantId,
        user: session.user,
    };
}

export async function requireTenant() {
    const tenant = await getCurrentTenant();

    if (!tenant) {
        throw new Error('Unauthorized: No tenant context found');
    }

    return tenant;
}
