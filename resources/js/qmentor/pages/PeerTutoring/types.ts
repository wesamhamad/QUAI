export type TutoringSubject =
  | 'math' | 'physics' | 'chemistry' | 'biology'
  | 'cs' | 'english' | 'arabic' | 'statistics'
  | 'accounting' | 'engineering' | 'islamic_studies' | 'management';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type SessionLocation = 'online' | 'campus';
export type LeaderboardPeriod = 'monthly' | 'semester' | 'all_time';
export type AvailabilityDay = 'sun' | 'mon' | 'tue' | 'wed' | 'thu';

export interface TimeSlot {
  day: AvailabilityDay;
  startHour: number;
  endHour: number;
}

export interface Tutor {
  id: string;
  nameAr: string;
  nameEn: string;
  studentId: string;
  collegeAr: string;
  collegeEn: string;
  subjects: TutoringSubject[];
  rating: number;
  totalSessions: number;
  availability: TimeSlot[];
  bio: string;
  bioEn: string;
  level: number; // academic year
  isTutor: boolean;
}

export interface MatchResult {
  tutor: Tutor;
  matchScore: number;
  reasonAr: string;
  reasonEn: string;
  mutualSlots: TimeSlot[];
}

export interface TutoringSession {
  id: string;
  tutorId: string;
  tutorNameAr: string;
  tutorNameEn: string;
  studentNameAr: string;
  studentNameEn: string;
  subject: TutoringSubject;
  date: string;
  startHour: number;
  endHour: number;
  location: SessionLocation;
  status: SessionStatus;
  rating?: number;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  tutor: Tutor;
  sessionsCompleted: number;
  avgRating: number;
  subjectsCovered: number;
  impactScore: number;
}

import type { LucideIcon } from 'lucide-react';

export interface SubjectInfo {
  key: TutoringSubject;
  nameAr: string;
  nameEn: string;
  icon: LucideIcon;
}
