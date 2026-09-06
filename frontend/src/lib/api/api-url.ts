export function getPublicApiRoot(): string {
    const raw = (
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    ).trim();
    const noTrail = raw.replace(/\/+$/, '');
    return noTrail.replace(/\/api\/v1\/?$/i, '');
}

export function getPublicApiV1Base(): string {
    return `${getPublicApiRoot()}/api/v1`;
}
