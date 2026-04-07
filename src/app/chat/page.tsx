"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import ProjectManager from "@/components/chat/ProjectManager";

export default function ChatPage() {
  const { data: session } = useSession();
  const [mobileView, setMobileView] = useState<"chat" | "project">("chat");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      // TODO: Set up Realtime Subscription
    }
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initConversation = async () => {
    try {
      // First try to get existing conversation
      let res = await fetch("/api/chat/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversation");
      let data = await res.json();
      
      if (!data) {
        // Create if none exists
        res = await fetch("/api/chat/conversations", { method: "POST" });
        if (!res.ok) throw new Error("Failed to create conversation");
        data = await res.json();
      }
      setConversationId(data.id);
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
    if (!conversationId) return;
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
          role: "customer",
        },
        ...fileData
      };
      
      setMessages(prev => [...prev, optimisticMsg]);
      setInputMessage("");

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content,
          ...fileData
        }),
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      
      await fetchMessages(conversationId);
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

  return (
    <div className="h-screen overflow-hidden flex flex-col w-full">
      {/* TopNavBar */}
      <Navbar />

      <main className="pt-20 flex-grow flex overflow-hidden">
        {/* Chat Interface */}
        <section className={`${mobileView === "chat" ? "flex" : "hidden"} md:flex w-full md:w-1/2 flex-col bg-surface-dim relative`}>
          {/* Message Area */}
          <div className="flex-grow overflow-y-auto px-8 py-10 space-y-6 custom-scrollbar">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-5xl mb-4 text-outline-variant/30">forum</span>
                <p>Send a message to start chatting</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender.id === session?.user?.id;
                
                return (
                  <div key={msg.id || i} className={`flex gap-4 max-w-2xl ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 mt-1 flex items-center justify-center font-bold text-xs ${
                      isMe 
                        ? "bg-primary-container text-on-primary-container" 
                        : "bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white shadow-lg"
                    }`}>
                      {isMe ? "ME" : "A"}
                    </div>
                    
                    <div className={`space-y-1 max-w-[85%] ${isMe ? "flex flex-col items-end" : ""}`}>
                      {/* File Attachment */}
                      {msg.fileUrl && (
                        <div className={`mb-2 rounded-xl overflow-hidden border ${isMe ? "border-primary-container/30 bg-primary-container/10" : "border-outline-variant/20 bg-surface-container-high"}`}>
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
                          isMe 
                            ? "bg-primary-container text-on-primary-container rounded-tr-sm" 
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
          <div className="p-8 bg-surface-dim border-t border-outline-variant/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(inputMessage); }}
              className="relative flex items-end bg-surface-container-highest rounded-3xl p-2 border border-outline-variant/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm"
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
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
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
                placeholder="Message your digital architect..."
                rows={Math.min(4, Math.max(1, inputMessage.split('\n').length))}
              />
              
              <div className="shrink-0 px-2 pb-1.5">
                <button 
                  type="submit"
                  disabled={!inputMessage.trim() && !isUploading}
                  className="w-10 h-10 bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Side - Project Progress */}
        <ProjectManager mobileView={mobileView} />
      </main>

      {/* Footer Mobile View */}
      <footer className="md:hidden w-full bg-zinc-950 dark:bg-[#131313] py-4 px-8 grid grid-cols-2 border-t border-outline-variant/30 z-50 shrink-0">
        <button
          onClick={() => setMobileView("chat")}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            mobileView === "chat" ? "text-indigo-400" : "text-zinc-500"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: mobileView === "chat" ? "'FILL' 1" : "'FILL' 0" }}>chat</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Chat</span>
        </button>
        <button
          onClick={() => setMobileView("project")}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            mobileView === "project" ? "text-indigo-400" : "text-zinc-500"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: mobileView === "project" ? "'FILL' 1" : "'FILL' 0" }}>assignment</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Project</span>
        </button>
      </footer>
    </div>
  );
}
