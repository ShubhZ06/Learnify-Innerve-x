const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mocking models to avoid importing TS files in a JS test script
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, select: false },
    role: { type: String, enum: ["STUDENT", "TEACHER"] }
}, { timestamps: true });

const ClassroomSchema = new mongoose.Schema({
    name: String,
    code: { type: String, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const EnrollmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Classroom = mongoose.models.Classroom || mongoose.model('Classroom', ClassroomSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);

const MONGODB_URI = "mongodb+srv://aryanyad74_db_user:RRhpxyF0ikY3AsbC@cluster0.gyuut8t.mongodb.net/?retryWrites=true&w=majority";

async function verifyConnection() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // 1. Create Mock Teacher
        const teacherEmail = `teacher_${Date.now()}@test.com`;
        const teacher = new User({
            name: "Test Teacher",
            email: teacherEmail,
            password: await bcrypt.hash("password123", 10),
            role: "TEACHER"
        });
        await teacher.save();
        console.log(`Created teacher: ${teacher.email}`);

        // 2. Create Classroom
        const classroomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const classroom = new Classroom({
            name: "Verifying Connection 101",
            code: classroomCode,
            teacherId: teacher._id
        });
        await classroom.save();
        console.log(`Created classroom: ${classroom.name} with code: ${classroom.code}`);

        // 3. Create Mock Student
        const studentEmail = `student_${Date.now()}@test.com`;
        const student = new User({
            name: "Test Student",
            email: studentEmail,
            password: await bcrypt.hash("password123", 10),
            role: "STUDENT"
        });
        await student.save();
        console.log(`Created student: ${student.email}`);

        // 4. Student Joins Classroom
        const enrollment = new Enrollment({
            studentId: student._id,
            classroomId: classroom._id
        });
        await enrollment.save();
        console.log(`Student ${student.name} joined classroom ${classroom.name}`);

        // 5. Verify Connection from Teacher's perspective
        const teacherClassrooms = await Classroom.find({ teacherId: teacher._id });
        console.log(`Teacher has ${teacherClassrooms.length} classroom(s)`);

        for (const cls of teacherClassrooms) {
            const students = await Enrollment.find({ classroomId: cls._id }).populate('studentId');
            console.log(`Classroom ${cls.name} has ${students.length} students enrolled:`);
            students.forEach(s => {
                console.log(` - ${s.studentId.name} (${s.studentId.email})`);
            });
        }

        // 6. Verify Connection from Student's perspective
        const studentEnrollments = await Enrollment.find({ studentId: student._id }).populate('classroomId');
        console.log(`Student is enrolled in ${studentEnrollments.length} classroom(s):`);
        for (const e of studentEnrollments) {
            const cls = e.classroomId;
            const teacherInfo = await User.findById(cls.teacherId);
            console.log(` - ${cls.name} (Teacher: ${teacherInfo.name})`);
        }

        console.log("\nVERIFICATION SUCCESSFUL: Students and Teachers are correctly connected!");

        // Cleanup
        await Enrollment.deleteMany({ _id: { $in: [enrollment._id] } });
        await Classroom.deleteMany({ _id: { $in: [classroom._id] } });
        await User.deleteMany({ _id: { $in: [teacher._id, student._id] } });
        console.log("Cleanup completed.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyConnection();
