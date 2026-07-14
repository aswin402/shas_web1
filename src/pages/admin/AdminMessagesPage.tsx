import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useContactSubmissions, type ContactSubmission } from '@/hooks/useContactSubmissions';
import { AdminTableSkeleton } from '@/components/common/LoadingSkeletons';
import { useToastStore } from '@/store/useToastStore';
import { 
  Search, 
  Inbox,
  AlertCircle,
  X,
  Mail,
  Calendar,
  User,
  Info,
  Copy
} from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ContactSubmission | null;
}

function InquiryModal({ isOpen, onClose, submission }: InquiryModalProps) {
  const addToast = useToastStore((state) => state.addToast);
  if (!isOpen || !submission) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(submission.email);
      addToast('Email address copied to clipboard.', 'success');
    } catch {
      addToast('Failed to copy email.', 'error');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(submission.message);
      addToast('Full message body copied to clipboard.', 'success');
    } catch {
      addToast('Failed to copy message.', 'error');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white border border-border/40 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-fade-in max-h-[90vh] flex flex-col text-deep-brown">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-cream/40">
          <h3 className="text-xl font-heading font-semibold text-deep-brown tracking-wide">
            Inquiry Details
          </h3>
          <button 
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-muted-brown hover:text-deep-brown hover:bg-cream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Sender
              </span>
              <p className="text-sm font-medium text-deep-brown">{submission.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <div className="flex items-center gap-1">
                <a href={`mailto:${submission.email}`} className="text-sm font-medium text-temple-red hover:underline truncate max-w-[150px] sm:max-w-none">
                  {submission.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  className="p-1 text-muted-brown hover:text-deep-brown hover:bg-cream rounded transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date Received
              </span>
              <p className="text-sm font-medium text-deep-brown">{formatDate(submission.created_at)}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Subject
              </span>
              <p className="text-sm font-medium text-deep-brown">
                {submission.subject || '(No Subject)'}
              </p>
            </div>
          </div>

          <div className="border-t border-border/20 pt-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">Message Body</span>
            <div className="bg-cream/40 border border-border/20 rounded-lg p-4 max-h-60 overflow-y-auto text-sm text-brown whitespace-pre-wrap leading-relaxed">
              {submission.message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/20 bg-cream/20 flex justify-end">
          <button
            onClick={handleCopyMessage}
            className="mr-3 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream bg-temple-red hover:bg-temple-red/90 rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Message
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-deep-brown bg-cream border border-border/30 hover:bg-cream/80 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function AdminMessagesPage() {
  const { data: submissions, isLoading, isError, error } = useContactSubmissions();

  if (isLoading) {
    return (
      <AdminTableSkeleton 
        title="Customer Messages & Inquiries" 
        subtitle="Manage and respond to client storefront contact queries" 
        srText="Loading inquiries..."
      />
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((sub) => {
      const matchName = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEmail = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = (sub.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchEmail || matchSubject;
    });
  }, [submissions, searchTerm]);

  const handleOpenModal = (sub: ContactSubmission) => {
    setSelectedSubmission(sub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-deep-brown tracking-wide">
            Customer Inquiries
          </h1>
          <p className="text-sm text-muted-brown uppercase tracking-widest mt-1">
            Read and Respond to contact inquiries
          </p>
        </div>
      </div>

      {/* Error alert */}
      {isError && (
        <div className="p-4 bg-temple-red/10 border border-temple-red/20 text-deep-brown rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-temple-red flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">System Error</h4>
            <p className="text-xs text-muted-brown mt-1">
              {error?.message || 'Failed to fetch contact submissions.'}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/80 border border-border/40 p-4 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-brown/40" />
          <input
            type="text"
            placeholder="Search inquiries by sender name, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cream/30 border border-border/25 focus:border-temple-red/30 rounded-lg pl-10 pr-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {isError ? null : filteredSubmissions.length === 0 ? (
        /* Empty state */
        <div className="min-h-[45vh] flex flex-col items-center justify-center gap-4 text-center px-4 border border-dashed border-border/30 rounded-xl bg-white/80 shadow-sm">
          <Inbox className="w-12 h-12 text-muted-brown/30" />
          <div>
            <h3 className="text-lg font-heading font-medium text-deep-brown">No Inquiries Found</h3>
            <p className="text-xs text-muted-brown max-w-sm mt-1">
              There are no messages matching your search query or no inquiries submitted yet.
            </p>
          </div>
        </div>
      ) : (
        /* Inquiries Table Grid */
        <div className="bg-white border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/45 border-b border-border/30">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Sender</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Subject</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Message Preview</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cream/15 transition-colors">
                    {/* Sender Info */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-deep-brown">{sub.name}</span>
                        <span className="text-xs text-muted-brown">{sub.email}</span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-deep-brown font-medium">
                        {sub.subject || <span className="text-muted-brown/40 italic">(No Subject)</span>}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-deep-brown">{formatDate(sub.created_at)}</span>
                    </td>

                    {/* Message Preview */}
                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="text-sm text-brown">{sub.message}</span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cream hover:bg-cream/80 border border-border/30 text-xs font-semibold uppercase tracking-wider text-deep-brown transition-all duration-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Viewer Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        submission={selectedSubmission}
      />
    </div>
  );
}
