import InterviewRoom from '@/components/interview/InterviewRoom';
import QuestionSelector from '@/components/interview/QuestionSelector';

export default function InterviewPage({ params }: { params: { id: string } }) {
    if (params.id === 'new') {
        return (
            <main className="min-h-screen bg-[#030303] overflow-x-hidden">
                <QuestionSelector />
            </main>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#030303] overflow-hidden">
            <InterviewRoom sessionId={params.id} />
        </div>
    );
}
