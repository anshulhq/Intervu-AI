import InterviewRoom from '@/components/interview/InterviewRoom';

export default function InterviewPage({ params }: { params: { id: string } }) {
    return (
        <div className="h-screen w-screen bg-[#030303] overflow-hidden">
            <InterviewRoom sessionId={params.id} />
        </div>
    );
}
