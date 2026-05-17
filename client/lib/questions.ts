export interface Question {
    title: string;
    description: string;
    examples: string[];
    starterCode: string;
    language: string;
    fileName: string;
    visualization?: string;
}

export const SUPPORTED_LANGUAGES: Record<string, { monacoId: string; fileExt: string; label: string }> = {
    java: { monacoId: 'java', fileExt: 'java', label: 'Java' },
    javascript: { monacoId: 'javascript', fileExt: 'js', label: 'JavaScript' },
    python: { monacoId: 'python', fileExt: 'py', label: 'Python' },
    typescript: { monacoId: 'typescript', fileExt: 'ts', label: 'TypeScript' },
    cpp: { monacoId: 'cpp', fileExt: 'cpp', label: 'C++' },
};

export function getFileName(question: Question): string {
    if (question.fileName) return question.fileName;
    const lang = SUPPORTED_LANGUAGES[question.language];
    return lang ? `Solution.${lang.fileExt}` : 'Solution.java';
}

export function getMonacoLanguage(question: Question): string {
    const lang = SUPPORTED_LANGUAGES[question.language];
    return lang ? lang.monacoId : 'java';
}
