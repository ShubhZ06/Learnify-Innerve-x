import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Classroom from '@/models/Classroom';
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

        // Try to find enrollment with BOTH string and ObjectId formats
        // This handles both old and new enrollment formats
        let enrollment = await Enrollment.findOne({
            studentId: session.user.id, // Try as string first
            classroomId: params.classroomId
        });

        // If not found as string, try as ObjectId
        if (!enrollment) {
            try {
                enrollment = await Enrollment.findOne({
                    studentId: new mongoose.Types.ObjectId(session.user.id),
                    classroomId: params.classroomId
                });
            } catch (err) {
                // Invalid ObjectId format, ignore
            }
        }

        if (!enrollment) {
            console.log('[ENROLLMENT CHECK] User:', session.user.id, 'Classroom:', params.classroomId, 'Result: NOT FOUND');
            return NextResponse.json(
                { error: 'Not enrolled in this classroom' },
                { status: 403 }
            );
        }

        console.log('[ENROLLMENT CHECK] User:', session.user.id, 'Classroom:', params.classroomId, 'Result: FOUND');

        // Fetch classroom details with teacher info
        const classroom = await Classroom.findById(params.classroomId)
            .populate('teacherId', 'name email')
            .lean();

        if (!classroom) {
            return NextResponse.json(
                { error: 'Classroom not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            classroom: {
                _id: classroom._id,
                name: classroom.name,
                code: classroom.code,
                teacher: classroom.teacherId,
                joinedAt: enrollment.joinedAt
            }
        });

    } catch (error) {
        console.error('Error fetching classroom:', error);
        return NextResponse.json(
            { error: 'Failed to fetch classroom details' },
            { status: 500 }
        );
    }
}
