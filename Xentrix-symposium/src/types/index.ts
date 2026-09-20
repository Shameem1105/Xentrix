export type EventCategory = 'Technical' | 'Non-Technical';

export interface SymposiumEvent {
  id: string;
  name: string;
  category: EventCategory;
  department?: string;
  teamSize: string;
  minMembers: number;
  maxMembers: number;
  fee: number;
  feeType?: 'Per Team' | 'Per Participant';
  prizePool: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  startTime: string;
  endTime: string;
  displayTime?: string;
  venue?: string;
  description: string;
  rules?: string[];
  iconName?: string;
  badge?: string;
  image?: string;
}

export interface TeamMemberInput {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  qr_token?: string;
}

export interface RegistrationFormData {
  teamName: string;
  collegeName: string;
  department: string;
  year: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMemberInput[];
  selectedEvents: SymposiumEvent[];
}

export interface EventConflict {
  event1: SymposiumEvent;
  event2: SymposiumEvent;
  reason: string;
}

export interface RegistrationResult {
  registrationId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string;
  collegeName: string;
  department: string;
  year?: string;
  membersCount?: number;
  members?: TeamMemberInput[];
  selectedEvents: SymposiumEvent[];
  events?: SymposiumEvent[];
  totalAmount: number;
  qrCodeUrl?: string;
  createdAt?: string;
}
