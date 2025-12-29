'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, Mail, Trash2, Reply, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminContactsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', statusFilter],
    queryFn: () => adminApi.getContacts({ status: statusFilter || undefined }),
  });

  const { data: stats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: adminApi.getContactStats,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'new' | 'read' | 'replied' }) =>
      adminApi.updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('Status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('Contact deleted');
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      adminApi.replyToContact(id, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('Reply sent successfully!');
      setReplyingTo(null);
      setReplyText('');
    },
    onError: () => {
      toast.error('Failed to send reply');
    },
  });

  const handleSendReply = (contactId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    replyMutation.mutate({ id: contactId, reply: replyText });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#425b30] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
        <p className="text-gray-600">{data?.total || 0} messages total</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">New</p>
            <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Read</p>
            <p className="text-3xl font-bold text-gray-600">{stats.read}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Replied</p>
            <p className="text-3xl font-bold text-green-600">{stats.replied}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card p-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30]"
        >
          <option value="">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
        </div>
      ) : data?.contacts && data.contacts.length > 0 ? (
        <div className="space-y-4">
          {data.contacts.map((contact, index) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#425b30] to-[#6b8f52] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  contact.status === 'new'
                    ? 'bg-blue-100 text-blue-700'
                    : contact.status === 'read'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {contact.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-2">{contact.subject}</p>
                <p className="text-gray-600">{contact.message}</p>
              </div>

              {/* Reply Section */}
              {contact.reply && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2 mb-2">
                    <Reply className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800 mb-1">Admin Reply:</p>
                      <p className="text-gray-700">{contact.reply}</p>
                      {contact.replyDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Replied on {new Date(contact.replyDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === contact._id && (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply:
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handleSendReply(contact._id!)}
                      disabled={replyMutation.isPending}
                      className="px-4 py-2 bg-[#425b30] text-white rounded-lg hover:bg-[#3a5428] transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {replyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{replyMutation.isPending ? 'Sending...' : 'Send Reply'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {new Date(contact.createdAt!).toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  {contact.status !== 'replied' && !replyingTo && (
                    <button
                      onClick={() => {
                        setReplyingTo(contact._id!);
                        setReplyText('');
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this message?')) {
                        deleteMutation.mutate(contact._id!);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-xl text-gray-600">No messages found</p>
        </div>
      )}
    </div>
  );
}
