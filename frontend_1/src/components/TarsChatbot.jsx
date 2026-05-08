import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Send } from 'lucide-react';
import { HfInference } from '@huggingface/inference';

const TarsChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Welcome! I am TARS, here to guide you to the right expertise. What can I help with today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Thinking about it...");
    const messagesEndRef = useRef(null);
    // Use a ref to ensure we always have the absolute latest messages for context history
    const messagesRef = useRef(messages);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const loadingPhrases = [
        "Thinking about it...",
        "Hmm...",
        "Let me think...",
        "Processing...",
        "Looking into that..."
    ];

    const scrollToBottom = () => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Ensure the user provides their API key in their environment
            const hfToken = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
            
            if (!hfToken) {
                // If no API key provided, just reply with a placeholder for now
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'assistant', content: "API Key is missing! Please configure VITE_HUGGINGFACE_API_KEY in your .env file." }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            let loadingInterval = setInterval(() => {
                setLoadingText(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
            }, 1500);

            const hf = new HfInference(hfToken);

            const template = `You are TARS, the official AI assistant for CXO Connect. CXO Connect is an exclusive network bridging forward-thinking companies and elite fractional leaders (like fractional CMOs, CFOs, etc.).
Your strict rules:
1. ONLY answer questions regarding CXO Connect, finding fractional leaders, or joining the network.
2. If asked ANYTHING outside the usage of the website's core (e.g., coding, general knowledge, math, unrelated advice), you must politely decline and state that you can only assist with CXO Connect related inquiries.
3. Keep your answers concise, professional, and helpful.
4. NEVER use markdown bold (**) or italic (*) marks anywhere in your response. Keep the text clean.
5. If your answer is in points, format it nicely with standard bullet points.
6. All answers MUST be under 100 words.`;

            // We must use chatCompletion for models restricted to the "conversational" task
            const result = await hf.chatCompletion({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [
                    { role: "system", content: template },
                    // Map previous messages using the ref to absolutely guarantee no stale context
                    ...messagesRef.current.filter(m => m.role !== 'assistant' || m.content !== 'Welcome! I am TARS, here to guide you to the right expertise. What can I help with today?').map(m => ({ role: m.role, content: m.content })),
                    { role: "user", content: userMessage }
                ],
                max_tokens: 180,
                temperature: 0.1
            });
            
            clearInterval(loadingInterval);
            
            // Strip out all * and ** marks completely
            let finalResponse = result.choices[0].message.content.trim().replace(/\*/g, '');
            
            setMessages(prev => [...prev, { role: 'assistant', content: finalResponse }]);
        } catch (error) {
            console.error("Error generating response:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* The Floating Button */}
            {!isOpen && (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#000000', color: '#ffffff', cursor: 'pointer', zIndex: 1000 }}
                    className="hover:-translate-y-1 transition-all flex items-center justify-center gap-3 px-6 py-4 shadow-2xl rounded-full border border-gray-800 group"
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                </div>
                    <span className="font-bold tracking-widest text-sm uppercase">Ask Tars</span>
                </motion.div>
            )}

            {/* The Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}
                        className="w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-[#f8f9fa] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-[#134e40] p-4 flex items-center justify-between text-white shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                                    <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">ASK TARS</h3>
                                    <p className="text-xs text-white/80">Chat Support</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                            <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div 
                                        className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap text-left ${
                                            msg.role === 'user' 
                                            ? 'bg-[#134e40] text-white rounded-br-sm shadow-md' 
                                            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                        <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm">
                                        <div className="flex gap-2 items-center h-full text-xs font-medium text-gray-500 italic">
                                            <span>{loadingText}</span>
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#134e40] flex items-center gap-3">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a] text-gray-800 shadow-inner"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TarsChatbot;
