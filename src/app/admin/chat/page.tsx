"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

type Conversation = {
  id: string;
  subject: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  messages: any[];
  _count: {
    messages: number;
  };
};

export default function AdminChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      
      // TODO: Set up Supabase Realtime subscription here
    }
  }, [activeConversationId]);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chat/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${convId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (content: string, fileData: any = null) => {
    if (!activeConversationId) return;
    if (!content.trim() && !fileData) return;

    try {
      // Optimistic UI update
      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        sender: {
          id: session?.user?.id,
          name: session?.user?.name,
          role: "admin",
        },
        ...fileData
      };
      
      setMessages(prev => [...prev, optimisticMsg]);
      setInputMessage("");

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          content,
          ...fileData
        }),
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      
      // We rely on real-time subscription to get the confirmed message,
      // but for now, we'll re-fetch just in case
      await fetchMessages(activeConversationId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const fileData = await res.json();
      
      // Send message with file
      await sendMessage("", {
        fileUrl: fileData.url,
        fileName: fileData.name,
        fileType: fileData.type,
        fileSize: fileData.size,
      });

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const activeConvDetails = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-full bg-surface-dim">
      {/* Sidebar: Conversations List */}
      <div className="w-80 border-r border-outline-variant/10 bg-surface-container flex flex-col shrink-0">
        <div className="p-4 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-white">Inbox</h2>
          <div className="relative mt-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
              <span className="text-sm">Loading...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
              No active conversations
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/5">
              {conversations.map(conv => {
                const isActive = activeConversationId === conv.id;
                const latestMsg = conv.messages[0];
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-4 text-left transition-colors flex gap-3 ${
                      isActive 
                        ? "bg-primary/5 text-white" 
                        : "hover:bg-surface-container-high/50 text-on-surface-variant"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0">
                      {conv.customer.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className={`font-semibold truncate ${isActive ? "text-primary" : "text-white"}`}>
                          {conv.customer.name || conv.customer.email}
                        </div>
                        <div className="text-[10px] whitespace-nowrap">
                          {format(new Date(conv.updatedAt), "HH:mm")}
                        </div>
                      </div>
                      <div className="text-xs truncate opacity-70">
                        {latestMsg?.content || (latestMsg?.fileName ? `📎 ${latestMsg.fileName}` : "No messages yet")}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] border-b border-outline-variant/10 px-6 flex items-center justify-between shrink-0 bg-surface-container-low/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  {activeConvDetails?.customer.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="font-bold text-white">{activeConvDetails?.customer.name || activeConvDetails?.customer.email}</div>
                  <div className="text-xs text-on-surface-variant">Customer Support</div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/noise.png')]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-70">
                  <span className="material-symbols-outlined text-5xl mb-4">forum</span>
                  <p>Message history will appear here</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isAdmin = msg.sender.role === 'admin';
                  
                  return (
                    <div key={msg.id || i} className={`flex gap-4 max-w-2xl ${isAdmin ? "ml-auto flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 mt-1 flex items-center justify-center font-bold text-xs ${
                        isAdmin 
                          ? "bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white" 
                          : "bg-surface-container-highest text-on-surface"
                      }`}>
                        {isAdmin ? "A" : (msg.sender.name?.charAt(0)?.toUpperCase() || "?")}
                      </div>
                      
                      <div className={`space-y-1 max-w-[85%] ${isAdmin ? "flex flex-col items-end" : ""}`}>
                        {/* File Attachment */}
                        {msg.fileUrl && (
                          <div className={`mb-2 rounded-xl overflow-hidden border ${isAdmin ? "border-primary/20 bg-primary/5" : "border-outline-variant/20 bg-surface-container-high"}`}>
                            {msg.fileType?.startsWith('image/') ? (
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                                <img src={msg.fileUrl} alt={msg.fileName} className="max-w-xs max-h-60 object-contain" />
                              </a>
                            ) : (
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 hover:bg-surface-container-highest transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                                <div className="text-left">
                                  <div className="text-sm font-semibold text-white truncate max-w-[200px]">{msg.fileName}</div>
                                  <div className="text-xs text-on-surface-variant">
                                    {msg.fileSize ? `${(msg.fileSize / 1024 / 1024).toFixed(2)} MB` : 'File'}
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                        )}
                        
                        {/* Text Content */}
                        {msg.content && (
                          <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                            isAdmin 
                              ? "bg-primary text-on-primary rounded-tr-sm" 
                              : "bg-surface-container-high text-on-surface rounded-tl-sm border border-outline-variant/5"
                          }`}>
                            {msg.content}
                          </div>
                        )}
                        
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold px-1">
                          {format(new Date(msg.createdAt), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-surface-dim border-t border-outline-variant/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(inputMessage); }}
                className="relative flex items-end bg-surface-container-high rounded-3xl p-2 border border-outline-variant/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm"
              >
                <div className="flex shrink-0 px-2 pb-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    ) : (
                      <span className="material-symbols-outlined text-[22px]">attach_file</span>
                    )}
                  </button>
                </div>
                
                <textarea 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputMessage);
                    }
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-2 py-3.5 max-h-32 min-h-[44px] text-[15px] resize-none outline-none custom-scrollbar" 
                  placeholder="Type a message to customer..."
                  rows={Math.min(4, Math.max(1, inputMessage.split('\n').length))}
                />
                
                <div className="shrink-0 px-2 pb-1.5">
                  <button 
                    type="submit"
                    disabled={!inputMessage.trim() && !isUploading}
                    className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-70">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant/30">chat</span>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose a customer from the left sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
