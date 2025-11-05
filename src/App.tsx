
import React, { useState, useCallback, useEffect } from 'react';
import { EmailTone } from './types';
import { generateEmail, translateText } from './services/geminiService';

// --- Icon Components ---
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 2.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75ZM10 15a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0v-1.75a.75.75 0 0 1 .75-.75ZM3.055 5.25a.75.75 0 0 1 .53 1.28l-1.75 1.75a.75.75 0 0 1-1.06-1.06l1.75-1.75a.75.75 0 0 1 .53-.22Zm12.14 9.5a.75.75 0 0 1 1.06 1.06l-1.75 1.75a.75.75 0 0 1-1.06-1.06l1.75-1.75ZM5.25 16.945a.75.75 0 0 1-1.28.53l-1.75-1.75a.75.75 0 0 1 1.06-1.06l1.75 1.75a.75.75 0 0 1 .22.53Zm9.5-12.14a.75.75 0 0 1 1.06-1.06l1.75 1.75a.75.75 0 0 1-1.06 1.06l-1.75-1.75ZM15 10a.75.75 0 0 1-.75.75h-1.75a.75.75 0 0 1 0-1.5h1.75a.75.75 0 0 1 .75.75Zm-10 0a.75.75 0 0 1-.75.75H2.5a.75.75 0 0 1 0-1.5h1.75a.75.75 0 0 1 .75.75Z" clipRule="evenodd" />
  </svg>
);

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25H9.75A2.25 2.25 0 0 1 7.5 4.5v0a2.25 2.25 0 0 1 2.25-2.25h3.879a2.25 2.25 0 0 1 1.95.734Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);
  
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 7.5 15 7.5h1.5m-3 0V3m3 2.621a48.473 48.473 0 0 1 6.375 0M12.75 3v2.621m2.25-2.621a48.473 48.473 0 0 0-6.375 0M9 15a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
    </svg>
);

// --- UI Components ---

const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400"></div>
  </div>
);

interface ToneSelectorProps {
  selectedTone: EmailTone;
  onToneChange: (tone: EmailTone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-100 mb-3">Select Tone</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {(Object.keys(EmailTone) as Array<keyof typeof EmailTone>).map((key) => (
          <button
            key={key}
            onClick={() => onToneChange(EmailTone[key])}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
              selectedTone === EmailTone[key]
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {EmailTone[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

interface EmailOutputProps {
  subject: string;
  onSubjectChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  hasGeneratedContent: boolean;
  isLoading: boolean;
  isTranslating: boolean;
  error: string | null;
  to: string;
  onToChange: (value: string) => void;
  cc: string;
  onCcChange: (value: string) => void;
  onSend: () => void;
  onShare: () => void;
  onTranslate: () => void;
  currentLanguage: 'en' | 'te';
}

const EmailOutput: React.FC<EmailOutputProps> = ({ 
    subject, onSubjectChange, body, onBodyChange, hasGeneratedContent, isLoading, isTranslating, error,
    to, onToChange, cc, onCcChange, onSend, onShare, onTranslate, currentLanguage
}) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        if (!body && !subject) return;
        const fullEmail = `Subject: ${subject}\n\n${body}`;

        navigator.clipboard.writeText(fullEmail).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };
    
    const isActionDisabled = !hasGeneratedContent || isLoading;

    return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 relative h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Generated Email</h2>
            <div className="flex items-center gap-2">
                <button onClick={handleCopy} disabled={isActionDisabled} className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${copySuccess ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'}`} aria-label="Copy email"><span className="sr-only">Copy</span>{copySuccess ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}</button>
                <button onClick={onSend} disabled={isActionDisabled} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-colors duration-200" aria-label="Send email"><span className="sr-only">Send</span><SendIcon className="w-5 h-5" /></button>
                {typeof navigator !== 'undefined' && navigator.share && <button onClick={onShare} disabled={isActionDisabled} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-colors duration-200" aria-label="Share email"><span className="sr-only">Share</span><ShareIcon className="w-5 h-5" /></button>}
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input type="email" placeholder="To:" value={to} onChange={(e) => onToChange(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
            <input type="email" placeholder="CC:" value={cc} onChange={(e) => onCcChange(e.target.value)} className="w-full sm:w-2/3 bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
        </div>

      {hasGeneratedContent && !isLoading && (
        <div className="mb-4">
          <label htmlFor="subject-input" className="text-sm font-medium text-slate-400">Subject</label>
          <input
            id="subject-input"
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="mt-1 w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-slate-100 font-semibold focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
        </div>
      )}

      <div className="bg-slate-900/50 rounded-lg p-4 flex-grow overflow-y-auto min-h-[200px]">
        {isLoading && <Loader />}
        {error && <div className="text-red-400 text-center p-4">{error}</div>}
        {!isLoading && !error && !hasGeneratedContent && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <SparklesIcon className="w-16 h-16 mb-4" />
                <p>Your generated email will appear here.</p>
            </div>
        )}
        {!isLoading && !error && hasGeneratedContent && (
             <textarea
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                className="w-full h-full bg-transparent text-slate-300 text-sm leading-relaxed resize-none focus:outline-none"
                aria-label="Email body"
            />
        )}
      </div>
      {!isLoading && hasGeneratedContent && (
        <div className="mt-4 text-center">
            <button onClick={onTranslate} disabled={isTranslating} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <LanguageIcon className="w-4 h-4" />
                {isTranslating ? 'Translating...' : (currentLanguage === 'en' ? 'Translate to Telugu' : 'Show Original')}
            </button>
        </div>
        )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [inputContent, setInputContent] = useState('');
  const [emailTone, setEmailTone] = useState<EmailTone>(EmailTone.Professional);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [translatedEmail, setTranslatedEmail] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'te'>('en');

  // Parse subject and body whenever the source email text changes
  useEffect(() => {
    const textToParse = currentLanguage === 'te' ? translatedEmail : generatedEmail;
    if (textToParse) {
        const subjectMatch = textToParse.match(/^Subject:\s*(.*)/im);
        const subjectText = subjectMatch ? subjectMatch[1] : '';
        setSubject(subjectText);

        const bodyText = subjectMatch
            ? textToParse.substring(subjectMatch[0].length).trim()
            : textToParse;
        setEmailBody(bodyText);
    } else {
        setSubject('');
        setEmailBody('');
    }
  }, [currentLanguage, generatedEmail, translatedEmail]);

  // Auto-fill 'To' field from input content after generation
  useEffect(() => {
    if (generatedEmail) {
        const toMatch = inputContent.match(/^To:\s*(.*)/im);
        if (toMatch && toMatch[1]) {
            setTo(toMatch[1].trim());
        }
    }
    // FIX: Removed `inputContent` from dependency array to prevent re-running the effect on every content change after generation.
  }, [generatedEmail]);

  const handleGenerateClick = useCallback(async () => {
    if (!inputContent) {
      setError('Please enter some content to generate an email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedEmail('');
    setTranslatedEmail('');
    setCurrentLanguage('en');

    try {
      const result = await generateEmail(inputContent, emailTone);
      setGeneratedEmail(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputContent, emailTone]);

  const handleTranslate = useCallback(async () => {
    if (currentLanguage === 'te') {
        setCurrentLanguage('en');
        return;
    }
    if (!generatedEmail) return;

    setIsTranslating(true);
    setError(null);
    try {
        const result = await translateText(generatedEmail, 'Telugu');
        setTranslatedEmail(result);
        setCurrentLanguage('te');
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unexpected error occurred during translation.');
        }
    } finally {
        setIsTranslating(false);
    }
  }, [generatedEmail, currentLanguage]);

  const handleSendEmail = () => {
    if (!emailBody) return;
    const mailtoLink = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleShare = async () => {
    if (!navigator.share || !emailBody) return;
    
    try {
        await navigator.share({ title: subject, text: emailBody });
    } catch (error) {
        console.error('Error sharing:', error);
    }
  };

  const hasGeneratedContent = generatedEmail !== '';

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Content to Email Generator
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Paste any content, choose a tone, and let AI craft the perfect email for you.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="space-y-8">
            <ToneSelector selectedTone={emailTone} onToneChange={setEmailTone} />
            <div>
                 <h2 className="text-lg font-semibold text-slate-100 mb-3">Your Content</h2>
                <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Paste your blog post, notes, or any text here..."
                    className="w-full h-80 min-h-[200px] p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-200 resize-y"
                />
            </div>
             <div className="pt-4">
                 <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                    >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate Email'}
                </button>
            </div>
          </div>

          <div className="min-h-[500px] lg:min-h-0">
             <EmailOutput 
                hasGeneratedContent={hasGeneratedContent}
                subject={subject}
                onSubjectChange={setSubject}
                body={emailBody}
                onBodyChange={setEmailBody}
                currentLanguage={currentLanguage}
                isLoading={isLoading} 
                isTranslating={isTranslating}
                error={error} 
                to={to}
                onToChange={setTo}
                cc={cc}
                onCcChange={setCc}
                onSend={handleSendEmail}
                onShare={handleShare}
                onTranslate={handleTranslate}
             />
          </div>
        </main>
        
        <footer className="text-center text-slate-500 text-sm py-8 mt-auto">
            Developed by Teja Thondrothu
        </footer>
      </div>
    </div>
  );
};

export default App;
