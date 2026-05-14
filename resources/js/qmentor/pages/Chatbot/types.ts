export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageType = 'text' | 'quick-reply' | 'card' | 'list' | 'escalation';

export interface QuickReplyOption {
  id: string;
  label: string;
  labelEn: string;
}

export interface CardData {
  title: string;
  titleEn: string;
  items: { label: string; labelEn: string; value: string; valueEn: string }[];
}

export interface ListData {
  title: string;
  titleEn: string;
  rows: { label: string; labelEn: string; description: string; descriptionEn: string }[];
}

export interface AttachmentData {
  name: string;
  type: 'image' | 'document' | 'other';
  size: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  contentEn: string;
  timestamp: string;
  quickReplies?: QuickReplyOption[];
  card?: CardData;
  list?: ListData;
  language: 'ar' | 'en';
  status?: 'sent' | 'delivered' | 'read';
  attachment?: AttachmentData;
}

export interface Conversation {
  id: string;
  title: string;
  titleEn: string;
  lastMessage: string;
  lastMessageEn: string;
  timestamp: string;
  pinned: boolean;
  archived: boolean;
  messages: Message[];
}
