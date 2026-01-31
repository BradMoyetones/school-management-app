// ========== USERS ==========
export interface User {
  id: string;
  name: string;
  lastname: string;
  document: number;
  email: string;
  image: string | null;
  password: string;
  is_verified: boolean;
  is_first_login: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ========== ACTIVITY CATEGORIES ==========
export interface ActivityCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== ACTIVITY TYPES ==========
export interface ActivityType {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  requires_observation: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== GROUPS ==========
export interface Group {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
  color: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ========== ATTENDANCE TYPES ==========
export interface AttendanceType {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== CALENDAR DAYS ==========
export interface CalendarDay {
  id: string;
  date: string;
  is_workable: boolean;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== CHILDREN ==========
export interface Child {
  id: string;
  group_id: string | null;
  attendance_type_id: string | null;
  name: string;
  lastname: string;
  document: string;
  birthdate: string;
  gender: 'M' | 'F';
  photo_url: string | null;
  health_info: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== CHILD GUARDIANS ==========
export interface ChildGuardian {
  id: string;
  child_id: string;
  user_id: string;
  relationship: string;
  is_emergency_contact: boolean;
  can_pickup: boolean;
  created_at: string;
  updated_at: string | null;
}

// ========== USER ONBOARDING ==========
export interface UserOnboarding {
  user_id: string;
  policies_accepted: boolean;
  policies_accepted_at: string | null;
  intro_video_watched: boolean;
  foundation_video_watched: boolean;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ========== DAILY ATTENDANCE ==========
export interface DailyAttendance {
  id: string;
  calendar_day_id: string;
  child_id: string;
  attended: boolean;
  check_in: string | null;
  check_out: string | null;
  dropped_off_by: string | null;
  picked_up_by: string | null;
  observation: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ========== DAILY AGENDA ITEMS ==========
export interface DailyAgendaItem {
  id: string;
  activity_type_id: string;
  group_id: string | null;
  calendar_day_id: string;
  order_index: number;
  title: string | null;
  created_at: string;
  updated_at: string | null;
}

// ========== CHILD ACTIVITY RECORDS ==========
export interface ChildActivityRecord {
  id: string;
  daily_agenda_item_id: string;
  child_id: string;
  status: string;
  observation: string | null;
  meta_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string | null;
}

// ========== INCIDENTS ==========
export interface Incident {
  id: string;
  child_id: string;
  reporter_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action_taken: string | null;
  parent_notified: boolean;
  parent_acknowledged_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ========== POSTS ==========
export interface Post {
  id: string;
  author_id: string;
  group_id: string | null;
  content: string;
  media_urls: string[] | null;
  created_at: string;
  deleted_at: string | null;
}

// ========== NOTIFICATIONS ==========
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  updated_at: string | null;
}
