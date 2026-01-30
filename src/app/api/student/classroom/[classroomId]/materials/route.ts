import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Material from '@/models/Material';
import Enrollment from '@/models/Enrollment';
import mongoose from 'mongoose';

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

        // Try both string and ObjectId formats for enrollment check
        let enrollment = await Enrollment.findOne({
            studentId: session.user.id,
            classroomId: params.classroomId
        });

        if (!enrollment) {
            try {
                enrollment = await Enrollment.findOne({
                    studentId: new mongoose.Types.ObjectId(session.user.id),
                    classroomId: params.classroomId
                });
            } catch (err) {
                // Ignore invalid ObjectId
            }
        }

        if (!enrollment) {
            return NextResponse.json(
                { error: 'Not enrolled in this classroom' },
                { status: 403 }
            );
        }

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
            assignments: materials.filter(m => m.type === 'assignment'),
            quizzes: materials.filter(m => m.type === 'quiz'),
            videos: materials.filter(m => m.type === 'video'),
            articles: materials.filter(m => m.type === 'article'),
            resources: materials.filter(m => m.type === 'resource'),
            announcements: materials.filter(m => m.type === 'announcement')
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
