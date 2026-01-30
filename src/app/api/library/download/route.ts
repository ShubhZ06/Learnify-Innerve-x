import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const content = searchParams.get('content'); // For AI generated content
    const title = searchParams.get('title') || 'download';

    if (content) {
        // Serve generated content directly
        const buffer = Buffer.from(content, 'utf-8');
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.txt`;
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    }

    if (!url) {
        return NextResponse.json({ error: 'URL or Content is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine extension
        let extension = 'bin';
        if (contentType.includes('pdf')) extension = 'pdf';
        else if (contentType.includes('word')) extension = 'doc';
        else if (contentType.includes('powerpoint')) extension = 'ppt';
        else if (url.endsWith('.pdf')) extension = 'pdf';

        // Sanitize title
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${extension}`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Download Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }
}
