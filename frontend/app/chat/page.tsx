'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AddCircleIcon,
  RefreshIcon,
  DeleteIcon,
  SendIcon,
  FileIcon,
  ChevronDownIcon,
  UserIcon,
  ChatIcon,
} from 'tdesign-icons-react';
import Head from 'next/head';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  unread: boolean;
}

const ConsultantPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'RAG技术咨询', timestamp: new Date(Date.now() - 3600000), unread: false },
    { id: '2', title: '项目规划讨论', timestamp: new Date(Date.now() - 86400000), unread: true },
    { id: '3', title: '智能客服方案', timestamp: new Date(Date.now() - 172800000), unread: false },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是智能咨询助理，我可以帮助您解答关于RAG技术、项目规划等方面的问题。',
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000),
      files: [
        { id: 'f1', name: 'RAG技术白皮书.pdf', type: 'pdf' },
        { id: 'f2', name: '项目规划模板.docx', type: 'docx' },
      ],
    },
    {
      id: '2',
      content: '我想了解RAG技术的基本原理',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      content:
        'RAG（Retrieval-Augmented Generation）是一种结合检索和生成的技术。它通过从知识库中检索相关信息，然后利用这些信息生成更准确的回答。',
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000),
      files: [{ id: 'f3', name: 'RAG架构图.png', type: 'png' }],
    },
    {
      id: '4',
      content: '能否提供一些具体的应用案例？',
      sender: 'user',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '5',
      content:
        '当然可以。RAG技术广泛应用于智能客服、企业知识库、学术研究等领域。例如，企业可以利用RAG构建智能客服系统，快速回答客户问题。',
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
      files: [{ id: 'f4', name: '应用案例分析.pdf', type: 'pdf' }],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: `${Date.now()}`,
      title: '新建会话',
      timestamp: new Date(),
      unread: false,
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: Message = {
      id: `${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // 添加用户消息
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now() + 1}`,
        content: `关于"${inputValue}"，我为您提供以下信息：智能咨询助理基于RAG技术，结合检索和生成能力，为您提供精准解答。`,
        sender: 'ai',
        timestamp: new Date(),
        files: inputValue.toLowerCase().includes('file')
          ? [{ id: `f${Date.now()}`, name: '相关资料.pdf', type: 'pdf' }]
          : [],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsSending(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString();
    }
  };

  const currentConversation =
    conversations.find((c) => c.id === currentConversationId) || conversations[0];

  return (
    <div className="flex h-screen bg-gray-50">
      <Head>
        <title>智能咨询助理</title>
        <meta name="description" content="智能咨询助理对话页面" />
      </Head>

      {/* 左侧侧边栏 */}
      <div className="w-80 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <AddCircleIcon size="18px" />
            <span>新建会话</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-400 px-2 py-2">历史会话</h3>
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    conversation.id === currentConversationId ? 'bg-gray-700' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setCurrentConversationId(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${conversation.unread ? 'font-medium text-white' : 'text-gray-300'}`}
                      >
                        {conversation.title}
                      </p>
                      {conversation.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(conversation.timestamp)} {formatTime(conversation.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">{currentConversation.title}</h1>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <RefreshIcon size="20px" />
            </button>
            <button className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100">
              <DeleteIcon size="20px" />
            </button>
          </div>
        </div>

        {/* 对话内容区 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] flex ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* 头像 */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'ml-3' : 'mr-3'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <UserIcon className="text-white" size="18px" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <ChatIcon className="text-gray-700" size="18px" />
                      </div>
                    )}
                  </div>

                  {/* 消息气泡 */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* 文件附件 */}
                    {message.files && message.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 text-sm p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                          >
                            <FileIcon className="text-blue-500" size="16px" />
                            <span className="truncate flex-1">{file.name}</span>
                            <ChevronDownIcon size="16px" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] flex">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <ChatIcon className="text-gray-700" size="18px" />
                  </div>
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-3 rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部输入区 */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end border border-gray-300 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题..."
                className="flex-1 border-0 rounded-xl resize-none py-3 px-4 focus:outline-none focus:ring-0"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !inputValue.trim()}
                className={`m-2 p-2 rounded-lg flex items-center justify-center ${
                  inputValue.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400'
                } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <SendIcon size="18px" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              输入 Enter 发送，Shift+Enter 换行
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantPage;
