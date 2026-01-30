import { auth } from "@/auth";
import { createClassroom, joinClassroom } from "@/actions/classroom";
import connectDB from "@/lib/db";
import Classroom from "@/models/Classroom";
import Enrollment from "@/models/Enrollment";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/login");
    }

    await connectDB();
    const role = session.user.role;
    let classrooms = [];

    if (role === "TEACHER") {
        classrooms = await Classroom.find({ teacherId: session.user.id }).sort({ createdAt: -1 });
    } else {
        const enrollments = await Enrollment.find({ studentId: session.user.id }).populate("classroomId");
        classrooms = enrollments.map((e) => e.classroomId); // Extract generic classroom info
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="text-gray-600">
                        Welcome, {session.user.name} ({role})
                    </div>
                </div>


                {/* Action Section */}
                <div className="mb-10 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                    {role === "TEACHER" ? (
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">Create a New Classroom</h2>
                            <form action={createClassroom} className="flex gap-4">
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Class Name (e.g. Physics 101)"
                                    required
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Create
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">Join a Classroom</h2>
                            <form action={joinClassroom} className="flex gap-4">
                                <input
                                    name="code"
                                    type="text"
                                    placeholder="Class Code (e.g. ABC123)"
                                    required
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Join
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* List Section */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Your Classrooms</h2>
                    {classrooms.length === 0 ? (
                        <p className="text-gray-500 italic">No classrooms found.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {classrooms.map((cls: any) => (
                                <div key={cls._id.toString()} className="rounded-lg bg-white p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">{cls.name}</h3>
                                    <div className="text-sm text-gray-500 mb-4">
                                        {role === "TEACHER" ? (
                                            <p>Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 font-bold">{cls.code}</span></p>
                                        ) : (
                                            <p>Student View</p>
                                        )}
                                    </div>
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                        Enter Classroom &rarr;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
