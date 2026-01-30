import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Material from '@/models/Material';

export async function GET(
    request: NextRequest,
    { params }: { params: { classroomId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        // Fetch all published materials for this classroom
        const materials = await Material.find({
            classroomId: params.classroomId,
            isPublished: true
        })
            .populate('teacherId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        // Group materials by type
        const groupedMaterials = {
            all: materials,
            assignments: materials.filter((m: any) => m.type === 'assignment'),
            quizzes: materials.filter((m: any) => m.type === 'quiz'),
            videos: materials.filter((m: any) => m.type === 'video'),
            articles: materials.filter((m: any) => m.type === 'article'),
            resources: materials.filter((m: any) => m.type === 'resource'),
            announcements: materials.filter((m: any) => m.type === 'announcement')
        };

        return NextResponse.json({
            materials: groupedMaterials,
            total: materials.length
        });

    } catch (error) {
        console.error('Error fetching materials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch materials' },
            { status: 500 }
        );
    }
}
