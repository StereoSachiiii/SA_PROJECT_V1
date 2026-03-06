import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { vendorApi } from '../../api/vendorApi';
import './HelpBot.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const HelpBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! I'm the Bookfair Assistant. How can I help you today? You can ask me about stall pricing, the designer, or event rules.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await vendorApi.askQuestion(input);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.answer,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having a technical glitch. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="help-bot-container">
            {!isOpen && (
                <button className="help-bot-fab" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div className="help-bot-window">
                    <div className="help-bot-header">
                        <div className="flex items-center gap-2">
                            <Bot size={20} className="text-indigo-600" />
                            <span className="font-semibold text-slate-800">Bookfair Help</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="help-bot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="help-bot-input">
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={isLoading}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpBot;
