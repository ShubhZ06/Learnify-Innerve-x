import Navbar from '@/components/student/Navbar';

export default function StudentLibrary() {
    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">Student Library</h1>
                <p>Your library content will appear here.</p>
            </div>
        </div>
    );
}
