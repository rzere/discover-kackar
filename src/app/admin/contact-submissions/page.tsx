'use client';

import { useState, useEffect } from 'react';
import { 
  Envelope, 
  Phone, 
  MapPin, 
  Calendar, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChatCircle,
  User
} from '@phosphor-icons/react';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country: string;
  country_code: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  new: Clock,
  read: Eye,
  replied: CheckCircle,
  closed: XCircle,
};

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('new');

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, currentPage]);

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/contact-submissions?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch submissions');
      }

      setSubmissions(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/contact-submissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          admin_notes: notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update submission');
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: status as any, admin_notes: notes, updated_at: new Date().toISOString() }
            : sub
        )
      );

      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => 
          prev ? { ...prev, status: status as any, admin_notes: notes, updated_at: new Date().toISOString() } : null
        );
      }

      setAdminNotes('');
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Error updating submission: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCountryFlag = (countryCode: string) => {
    const flagMap: Record<string, string> = {
      'TR': '🇹🇷', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭',
      'AT': '🇦🇹', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
      'CA': '🇨🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'JP': '🇯🇵', 'KR': '🇰🇷',
    };
    return flagMap[countryCode] || '🌍';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-2">Manage contact form submissions and customer inquiries</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Submissions ({submissions.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => {
                const StatusIcon = statusIcons[submission.status];
                return (
                  <div
                    key={submission.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {submission.name}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                            <StatusIcon size={12} className="mr-1" />
                            {submission.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Envelope size={14} />
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              {submission.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {getCountryFlag(submission.country_code)} {submission.country}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {submission.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          {formatDate(submission.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-1">
          {selectedSubmission ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{selectedSubmission.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Envelope size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-primary hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </div>
                    {selectedSubmission.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <a href={`tel:${selectedSubmission.phone}`} className="text-sm text-primary hover:underline">
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {getCountryFlag(selectedSubmission.country_code)} {selectedSubmission.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this submission..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    rows={3}
                  />
                  {selectedSubmission.admin_notes && (
                    <div className="mt-2 bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Previous notes:</strong> {selectedSubmission.admin_notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
                  <div className="space-y-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(selectedSubmission.id, selectedStatus, adminNotes)}
                      className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Created: {formatDate(selectedSubmission.created_at)}</div>
                    <div>Updated: {formatDate(selectedSubmission.updated_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ChatCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
