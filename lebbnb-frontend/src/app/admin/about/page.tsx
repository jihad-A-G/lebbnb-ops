'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, publicApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, Save, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { About } from '@/types';

type TabType = 'basic' | 'mission' | 'team' | 'stats';

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const queryClient = useQueryClient();

  // Fetch existing about data
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: publicApi.getAbout,
  });

  // Basic Info State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');

  // Mission & Vision State
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<Array<{
    name: string;
    position: string;
    bio?: string;
    image?: string;
  }>>([]);

  // Company Stats State
  const [companyStats, setCompanyStats] = useState<Array<{
    label: string;
    value: string;
  }>>([]);

  // Load existing data when fetched
  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || '');
      setSubtitle(aboutData.subtitle || '');
      setDescription(aboutData.description || '');
      setMission(aboutData.mission || '');
      setVision(aboutData.vision || '');
      setValues(aboutData.values || []);
      setTeamMembers(aboutData.teamMembers || []);
      setCompanyStats(aboutData.companyStats || []);
    }
  }, [aboutData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<About>) => adminApi.updateAbout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About page updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update about page');
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      title,
      subtitle,
      description,
      mission,
      vision,
      values,
      teamMembers,
      companyStats,
    });
  };

  const addValue = () => {
    if (newValue.trim()) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', position: '', bio: '' }]);
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const addCompanyStat = () => {
    setCompanyStats([...companyStats, { label: '', value: '' }]);
  };

  const updateCompanyStat = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...companyStats];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyStats(updated);
  };

  const removeCompanyStat = (index: number) => {
    setCompanyStats(companyStats.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'team', label: 'Team Members' },
    { id: 'stats', label: 'Company Stats' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit About Page</h1>
        <p className="text-gray-600">Manage your company's about page content</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[#425b30] border-b-2 border-[#425b30]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                placeholder="About Our Company"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                placeholder="Your trusted partner in property rental"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                placeholder="Tell your company's story..."
                required
              />
            </div>
          </div>
        )}

        {/* Mission & Vision Tab */}
        {activeTab === 'mission' && (
          <div className="space-y-6">
            <div className="card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                  placeholder="Our mission is to..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Statement
                </label>
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                  placeholder="We envision a future where..."
                />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Values</h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addValue()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                  placeholder="Add a value..."
                />
                <button
                  onClick={addValue}
                  className="px-4 py-2 bg-[#425b30] text-white rounded-lg hover:bg-[#3a5428] transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-900">{value}</span>
                    <button
                      onClick={() => removeValue(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
              <button
                onClick={addTeamMember}
                className="px-4 py-2 bg-[#425b30] text-white rounded-lg hover:bg-[#3a5428] transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {teamMembers.map((member, index) => (
              <div key={index} className="card p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Team Member #{index + 1}</h4>
                  <button
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={member.position}
                      onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                      placeholder="CEO & Founder"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={member.bio || ''}
                    onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                    placeholder="Brief biography..."
                  />
                </div>
              </div>
            ))}

            {teamMembers.length === 0 && (
              <div className="card p-12 text-center text-gray-500">
                No team members added yet. Click "Add Team Member" to get started.
              </div>
            )}
          </div>
        )}

        {/* Company Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Company Statistics</h3>
              <button
                onClick={addCompanyStat}
                className="px-4 py-2 bg-[#425b30] text-white rounded-lg hover:bg-[#3a5428] transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Statistic</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyStats.map((stat, index) => (
                <div key={index} className="card p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">Stat #{index + 1}</h4>
                    <button
                      onClick={() => removeCompanyStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateCompanyStat(index, 'label', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                      placeholder="Years of Experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value *
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateCompanyStat(index, 'value', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#425b30] focus:border-transparent"
                      placeholder="10+"
                    />
                  </div>
                </div>
              ))}
            </div>

            {companyStats.length === 0 && (
              <div className="card p-12 text-center text-gray-500">
                No statistics added yet. Click "Add Statistic" to get started.
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-8 py-3 bg-gradient-to-r from-[#425b30] to-[#6b8f52] text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
