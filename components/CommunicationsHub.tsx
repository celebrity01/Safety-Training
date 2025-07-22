import React, { useState, useEffect } from 'react';
import { useAppContext } from '../types';
import { Broadcasts } from './Broadcasts';
import { Messaging } from './Messaging';
import { ActivityFeed } from './ActivityFeed';
import { WeatherAlert } from './WeatherAlert';
import { MegaphoneIcon, ChatBubbleIcon, BrainIcon, LightbulbIcon, AlertBellIcon } from '../constants';
import { getPersonalizedRecommendations } from '../services/geminiService';

interface Recommendation {
  contextualAlert: string;
  trainingRecommendationKey: string;
  trainingRecommendationReason: string;
  preparednessTip: string;
}

// Enhanced SVG Icons
const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const CommunicationsHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'broadcasts' | 'messaging' | 'insights'>('broadcasts');
    const { t, setView, location } = useAppContext();
    const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (location && activeTab === 'insights') {
            loadRecommendations();
        }
    }, [location, activeTab]);
    
    const loadRecommendations = async () => {
        if (!location) return;
        
        setLoading(true);
        try {
            const recs = await getPersonalizedRecommendations(location, 1, {}, "en");
            setRecommendations(recs);
        } catch (e) {
            console.error("Failed to load recommendations:", e);
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'broadcasts': return <Broadcasts />;
            case 'messaging': return <Messaging />;
            case 'insights': return (
                <div className="space-y-8">
                                        {/* AI Insights Section */}
                    {location && (
                        <div className="relative overflow-hidden">
                            {/* Dark background layers */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-black/70 rounded-3xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-purple-900/10 to-transparent rounded-3xl"></div>

                            <div className="relative glass-card p-8 rounded-3xl border border-slate-600/40 backdrop-blur-sm shadow-2xl shadow-brand/10">
                                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3 drop-shadow-lg">
                                    <BrainIcon className="w-7 h-7 text-brand drop-shadow-md" />
                                    AI-Powered Insights for {location}
                                </h2>
                            
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center gap-3 text-lg text-slate-300">
                                        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                                        Analyzing regional data...
                                    </div>
                                </div>
                            ) : recommendations ? (
                                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="relative overflow-hidden">
                                        {/* Dark overlay for Regional Alert */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-red-900/60 to-black/80 rounded-2xl"></div>
                                        <div className="absolute inset-0 bg-warning/10 rounded-2xl"></div>

                                        <div className="relative bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/30 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-warning/20">
                                            <div className="w-12 h-12 bg-warning-light rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                                <AlertBellIcon className="w-6 h-6 text-warning drop-shadow-md" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-100 mb-3 drop-shadow-md">Regional Alert</h3>
                                            <p className="text-gray-200 mb-4 leading-relaxed drop-shadow-sm">
                                                {recommendations.contextualAlert}
                                            </p>
                                            <button className="btn btn-outline w-full group hover:border-warning hover:text-warning shadow-md hover:shadow-warning/20 transition-all">
                                                Learn More
                                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                                                        <div className="relative overflow-hidden">
                                        {/* Dark overlay for Recommended Training */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-black/80 rounded-2xl"></div>
                                        <div className="absolute inset-0 bg-brand/10 rounded-2xl"></div>

                                        <div className="relative bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/30 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-brand/20">
                                            <div className="w-12 h-12 bg-brand-primary-light rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                                <BrainIcon className="w-6 h-6 text-brand drop-shadow-md" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-100 mb-3 drop-shadow-md">Recommended Training</h3>
                                            <p className="text-gray-200 mb-4 leading-relaxed drop-shadow-sm">
                                                {recommendations.trainingRecommendationReason}
                                            </p>
                                            <button
                                                onClick={() => setView('game')}
                                                className="btn btn-primary w-full group shadow-md hover:shadow-brand/30 transition-all"
                                            >
                                                Start Training
                                                <PlayIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                                                        <div className="relative overflow-hidden">
                                        {/* Dark overlay for Safety Tip */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-green-900/60 to-black/80 rounded-2xl"></div>
                                        <div className="absolute inset-0 bg-success/10 rounded-2xl"></div>

                                        <div className="relative bg-gradient-to-br from-success/10 to-success/5 border border-success/30 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-success/20">
                                            <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                                <LightbulbIcon className="w-6 h-6 text-success drop-shadow-md" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-100 mb-3 drop-shadow-md">Safety Tip</h3>
                                            <p className="text-gray-200 mb-4 leading-relaxed drop-shadow-sm">
                                                {recommendations.preparednessTip}
                                            </p>
                                            <button className="btn btn-outline w-full group hover:border-success hover:text-success shadow-md hover:shadow-success/20 transition-all">
                                                View All Tips
                                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">🤖</div>
                                    <p className="text-slate-400">Select your location to receive personalized insights</p>
                                </div>
                            )}
                                                    </div>
                        </div>
                    )}
                    
                                        {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative overflow-hidden">
                            {/* Dark overlay for View Progress */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/70 via-orange-900/50 to-black/60 rounded-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-500/5 rounded-2xl"></div>

                            <div className="relative glass-card p-6 rounded-2xl border border-slate-600/40 hover:border-brand/50 transition-all group cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-brand/20"
                                 onClick={() => setView('achievements')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <span className="text-2xl drop-shadow-md">🏆</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-brand transition-colors drop-shadow-md">View Progress</h3>
                                        <p className="text-sm text-slate-400 drop-shadow-sm">Track achievements & XP</p>
                                    </div>
                                </div>
                                <div className="text-brand font-semibold flex items-center gap-2 group-hover:gap-4 transition-all drop-shadow-sm">
                                    <span>Open Dashboard</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        
                                                <div className="relative overflow-hidden">
                            {/* Dark overlay for Continue Training */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-950/70 via-green-900/50 to-black/60 rounded-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-success-dark/5 rounded-2xl"></div>

                            <div className="relative glass-card p-6 rounded-2xl border border-slate-600/40 hover:border-success/50 transition-all group cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-success/20"
                                 onClick={() => setView('game')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-success to-success-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <PlayIcon className="w-6 h-6 text-white drop-shadow-md" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-success transition-colors drop-shadow-md">Continue Training</h3>
                                        <p className="text-sm text-slate-400 drop-shadow-sm">Resume your safety training</p>
                                    </div>
                                </div>
                                <div className="text-success font-semibold flex items-center gap-2 group-hover:gap-4 transition-all drop-shadow-sm">
                                    <span>Start Session</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
            default: return <Broadcasts />;
        }
    };

    const getTabClass = (tabName: 'broadcasts' | 'messaging' | 'insights') => {
        if (activeTab === tabName) {
            return 'relative bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-black/70 border-blue-400 text-gray-100 shadow-lg shadow-blue-500/20 backdrop-blur-sm rounded-t-xl px-4 py-2 -mb-2';
        }
        return 'relative bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-black/40 border-transparent text-slate-300 hover:text-gray-100 hover:border-slate-400 hover:bg-gradient-to-br hover:from-slate-800/70 hover:via-slate-700/60 hover:to-black/50 backdrop-blur-sm rounded-t-xl px-4 py-2 transition-all duration-300 hover:shadow-md hover:shadow-slate-500/10';
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in p-4">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-4xl font-bold text-gray-100 text-glow">{t('commsHubTitle')}</h1>
                <button onClick={() => setView('dashboard')} className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm sm:text-base">
                   {'\u2190'} {t('backToDashboard')}
                </button>
            </div>

            <div className="border-b border-slate-600/60 mb-8 bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 rounded-lg p-2">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('broadcasts')}
                        className={`flex items-center gap-3 whitespace-nowrap font-semibold text-lg transition-all duration-300 hover:scale-105 ${getTabClass('broadcasts')}`}
                    >
                        {/* Dark overlay for active tab */}
                        {activeTab === 'broadcasts' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-transparent rounded-t-xl"></div>
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            <MegaphoneIcon className={`w-6 h-6 ${activeTab === 'broadcasts' ? 'text-blue-300 drop-shadow-md' : ''}`} />
                            <span className="drop-shadow-sm">{t('broadcastsTab')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('messaging')}
                        className={`flex items-center gap-3 whitespace-nowrap font-semibold text-lg transition-all duration-300 hover:scale-105 ${getTabClass('messaging')}`}
                    >
                        {/* Dark overlay for active tab */}
                        {activeTab === 'messaging' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-transparent rounded-t-xl"></div>
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            <ChatBubbleIcon className={`w-6 h-6 ${activeTab === 'messaging' ? 'text-green-300 drop-shadow-md' : ''}`} />
                            <span className="drop-shadow-sm">{t('messagingTab')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`flex items-center gap-3 whitespace-nowrap font-semibold text-lg transition-all duration-300 hover:scale-105 ${getTabClass('insights')}`}
                    >
                        {/* Dark overlay for active tab */}
                        {activeTab === 'insights' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-t-xl"></div>
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            <BrainIcon className={`w-6 h-6 ${activeTab === 'insights' ? 'text-purple-300 drop-shadow-md' : ''}`} />
                            <span className="drop-shadow-sm">AI Insights</span>
                        </div>
                    </button>
                </nav>
            </div>
            
            <div className="animate-fade-in">
                {renderTabContent()}
            </div>
            
            {/* Floating Components */}
            <WeatherAlert />
            <ActivityFeed />
        </div>
    );
};
