import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, ChatContact, Message } from '../types';
import { languageNames } from '../translations';
import { generateChatReply } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const Messaging: React.FC = () => {
    const { t, language, unlockAchievement } = useAppContext();
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const initialContacts: ChatContact[] = [
        { id: 'family', name: t('familyGroupChat'), avatar: '😊', lastMessage: "Everyone check in, please.", unread: 1 },
        { id: 'community', name: t('communityWatchChat'), avatar: '🏠', lastMessage: "Stay indoors. We'll share updates.", unread: 0 },
        { id: 'neighbor', name: t('neighborChat'), avatar: '👤', lastMessage: "Are you okay over there?", unread: 0 },
    ];

    const initialMessages: Record<string, Message[]> = {
        family: [
            { id: 1, text: "Everyone check in, please.", sender: 'contact', timestamp: new Date(Date.now() - 60000 * 5).toISOString() }
        ],
        community: [
            { id: 1, text: "Official Announcement: Please stay indoors until further notice. We will share updates as they come.", sender: 'system', timestamp: new Date(Date.now() - 60000 * 10).toISOString() }
        ],
        neighbor: [
            { id: 1, text: "Hey, just checking in. Are you okay over there?", sender: 'contact', timestamp: new Date(Date.now() - 60000 * 2).toISOString() }
        ],
    };
    
    const [contacts, setContacts] = useState<ChatContact[]>(initialContacts);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
    const [userInput, setUserInput] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, selectedChatId]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { // Re-initialize contacts and messages when language changes
        const newContacts: ChatContact[] = [
            { id: 'family', name: t('familyGroupChat'), avatar: '😊', lastMessage: "Everyone check in, please.", unread: 1 },
            { id: 'community', name: t('communityWatchChat'), avatar: '🏠', lastMessage: "Stay indoors. We'll share updates.", unread: 0 },
            { id: 'neighbor', name: t('neighborChat'), avatar: '👤', lastMessage: "Are you okay over there?", unread: 0 },
        ];
        const newMessages: Record<string, Message[]> = {
            family: [{ id: 1, text: "Everyone check in, please.", sender: 'contact', timestamp: new Date(Date.now() - 60000 * 5).toISOString() }],
            community: [{ id: 1, text: "Official Announcement: Please stay indoors until further notice. We will share updates as they come.", sender: 'system', timestamp: new Date(Date.now() - 60000 * 10).toISOString() }],
            neighbor: [{ id: 1, text: "Hey, just checking in. Are you okay over there?", sender: 'contact', timestamp: new Date(Date.now() - 60000 * 2).toISOString() }],
        };
        setContacts(newContacts);
        setMessages(newMessages);
    }, [t]);


    const handleSelectChat = (id: string) => {
        setSelectedChatId(id);
        setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !selectedChatId || isReplying) return;

        unlockAchievement('chat_starter');

        const newUserMessage: Message = {
            id: Date.now(),
            text: userInput,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        
        const currentChat = messages[selectedChatId] || [];
        const updatedMessages = [...currentChat, newUserMessage];
        
        setMessages(prev => ({ ...prev, [selectedChatId]: updatedMessages }));
        setUserInput('');
        setIsReplying(true);

        const chatHistoryText = updatedMessages.map(m => `${m.sender === 'user' ? 'Me' : 'Them'}: ${m.text}`).join('\n');
        const contactName = contacts.find(c => c.id === selectedChatId)?.name || 'contact';

        try {
            const replyText = await generateChatReply(chatHistoryText, contactName, languageNames[language]);
            const newReplyMessage: Message = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'contact',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => ({ ...prev, [selectedChatId]: [...updatedMessages, newReplyMessage] }));
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: t('errorChat'),
                sender: 'system',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => ({ ...prev, [selectedChatId]: [...updatedMessages, errorMessage] }));
        } finally {
            setIsReplying(false);
        }
    };

    const selectedChat = selectedChatId ? messages[selectedChatId] : null;
    const selectedContact = selectedChatId ? contacts.find(c => c.id === selectedChatId) : null;

    return (
        <div className="flex flex-col md:flex-row h-[70vh] glass-pane rounded-2xl overflow-hidden shadow-2xl">
            <div className={`w-full md:w-1/3 border-r border-slate-700/80 bg-slate-900/30 overflow-y-auto ${selectedChatId ? 'hidden md:block' : 'block'}`}>
                {contacts.map(contact => (
                    <div key={contact.id} onClick={() => handleSelectChat(contact.id)}
                        className={`p-4 flex items-center cursor-pointer border-b border-slate-700/50 transition-colors relative ${selectedChatId === contact.id ? 'bg-slate-700/50' : 'hover:bg-slate-800/40'}`}>
                        {selectedChatId === contact.id && <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-full"></div>}
                        <span className="text-3xl mr-4 p-1">{contact.avatar}</span>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-bold text-white truncate">{contact.name}</p>
                            <p className="text-sm text-slate-400 truncate">{contact.lastMessage}</p>
                        </div>
                        {contact.unread > 0 && <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2">{contact.unread}</span>}
                    </div>
                ))}
            </div>

            <div className={`w-full md:w-2/3 flex flex-col bg-transparent ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        <header className="p-4 border-b border-slate-700/80 flex items-center gap-4 bg-slate-800/50 shrink-0">
                           {selectedChatId && <button className="md:hidden text-white font-bold p-2" onClick={() => setSelectedChatId(null)}>{'\u2190'}</button>}
                           <span className="text-4xl">{selectedContact?.avatar}</span>
                           <h2 className="font-bold text-xl text-white">{selectedContact?.name}</h2>
                        </header>
                        <div className="flex-grow p-6 overflow-y-auto space-y-5 bg-slate-800/20">
                            {selectedChat.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${
                                        msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' :
                                        msg.sender === 'contact' ? 'bg-slate-600 text-white rounded-bl-lg' : 'bg-slate-700/80 text-yellow-200 italic text-sm w-full text-center'
                                    }`}>
                                        <p className="text-base leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isReplying && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="max-w-xs lg:max-w-md p-3 rounded-2xl bg-slate-600 text-white rounded-bl-lg">
                                        <LoadingSpinner/>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/80 bg-slate-800/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}
                                    placeholder={t('messagePlaceholder')}
                                    className="w-full bg-slate-700/80 text-white rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/80 border border-transparent focus:border-blue-500 transition" />
                                <button type="submit" disabled={isReplying || !userInput.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-full disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors flex-shrink-0 transform hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-center text-slate-400 p-4">
                        <p className="text-lg">{t('messagingPlaceholder')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};