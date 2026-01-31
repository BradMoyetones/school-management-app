import type {
  User,
  Group,
  Child,
  CalendarDay,
  DailyAttendance,
  Incident,
  Post,
  ActivityType,
  DailyAgendaItem,
  Notification,
} from "./types";

// ========== USERS ==========
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah",
    lastname: "Jenkins",
    document: 12345678,
    email: "sarah.jenkins@littlelearners.com",
    image: null,
    password: "hashed",
    is_verified: true,
    is_first_login: false,
    deleted_at: null,
    created_at: "2023-01-15T10:00:00Z",
    updated_at: null,
  },
  {
    id: "user-2",
    name: "Emily",
    lastname: "Johnson",
    document: 23456789,
    email: "emily.johnson@littlelearners.com",
    image: null,
    password: "hashed",
    is_verified: true,
    is_first_login: false,
    deleted_at: null,
    created_at: "2023-02-20T10:00:00Z",
    updated_at: null,
  },
  {
    id: "user-3",
    name: "Mike",
    lastname: "Parker",
    document: 34567890,
    email: "mike.parker@email.com",
    image: null,
    password: "hashed",
    is_verified: true,
    is_first_login: false,
    deleted_at: null,
    created_at: "2023-03-10T10:00:00Z",
    updated_at: null,
  },
];

// ========== GROUPS ==========
export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Infants",
    min_age: 0,
    max_age: 18,
    color: "#3B82F6",
    deleted_at: null,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
  },
  {
    id: "group-2",
    name: "Toddlers",
    min_age: 18,
    max_age: 36,
    color: "#10B981",
    deleted_at: null,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
  },
  {
    id: "group-3",
    name: "Pre-K",
    min_age: 36,
    max_age: 60,
    color: "#F59E0B",
    deleted_at: null,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
  },
  {
    id: "group-4",
    name: "After School",
    min_age: 60,
    max_age: 120,
    color: "#8B5CF6",
    deleted_at: null,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
  },
];

// ========== CHILDREN ==========
export const mockChildren: Child[] = [
  {
    id: "child-1",
    group_id: "group-2",
    attendance_type_id: "att-1",
    name: "Emma",
    lastname: "Parker",
    document: "DOC001",
    birthdate: "2021-05-15",
    gender: "F",
    photo_url: null,
    health_info: "Peanut allergy",
    is_active: true,
    created_at: "2023-01-15T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "child-2",
    group_id: "group-2",
    attendance_type_id: "att-1",
    name: "Liam",
    lastname: "Johnson",
    document: "DOC002",
    birthdate: "2021-08-22",
    gender: "M",
    photo_url: null,
    health_info: null,
    is_active: true,
    created_at: "2023-02-10T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "child-3",
    group_id: "group-2",
    attendance_type_id: "att-1",
    name: "Sophia",
    lastname: "Miller",
    document: "DOC003",
    birthdate: "2021-03-10",
    gender: "F",
    photo_url: null,
    health_info: "Asthma - inhaler in bag",
    is_active: true,
    created_at: "2023-03-05T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "child-4",
    group_id: "group-1",
    attendance_type_id: "att-1",
    name: "Oliver",
    lastname: "Davis",
    document: "DOC004",
    birthdate: "2022-11-20",
    gender: "M",
    photo_url: null,
    health_info: null,
    is_active: true,
    created_at: "2023-04-12T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "child-5",
    group_id: "group-3",
    attendance_type_id: "att-1",
    name: "Ava",
    lastname: "Wilson",
    document: "DOC005",
    birthdate: "2020-07-08",
    gender: "F",
    photo_url: null,
    health_info: null,
    is_active: true,
    created_at: "2023-05-20T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "child-6",
    group_id: "group-3",
    attendance_type_id: "att-1",
    name: "Marcus",
    lastname: "Aurelius",
    document: "DOC006",
    birthdate: "2019-04-12",
    gender: "M",
    photo_url: null,
    health_info: null,
    is_active: true,
    created_at: "2023-06-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
];

// ========== CALENDAR DAYS ==========
function generateCalendarDays(): CalendarDay[] {
  const days: CalendarDay[] = [];
  const year = 2023;
  const month = 10; // October

  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    days.push({
      id: `cal-day-${day}`,
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      is_workable: !isWeekend,
      description: getSpecialDayDescription(day),
      created_at: "2023-01-01T10:00:00Z",
      updated_at: null,
      deleted_at: null,
    });
  }

  return days;
}

function getSpecialDayDescription(day: number): string | null {
  const specialDays: Record<number, string> = {
    5: "Science Fair",
    11: "Public Holiday",
    12: "Autumn Leaves Workshop",
    14: "Nature Walk",
    20: "Fall Picture Day",
  };
  return specialDays[day] || null;
}

export const mockCalendarDays: CalendarDay[] = generateCalendarDays();

// ========== ACTIVITY TYPES ==========
export const mockActivityTypes: ActivityType[] = [
  {
    id: "act-1",
    category_id: "cat-1",
    name: "Morning Snack",
    icon: "apple",
    requires_observation: false,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-2",
    category_id: "cat-2",
    name: "Story Time",
    icon: "book",
    requires_observation: false,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-3",
    category_id: "cat-3",
    name: "Outdoor Play",
    icon: "sun",
    requires_observation: false,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-4",
    category_id: "cat-4",
    name: "Arts & Crafts",
    icon: "palette",
    requires_observation: true,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-5",
    category_id: "cat-5",
    name: "Music Day",
    icon: "music",
    requires_observation: false,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-6",
    category_id: "cat-6",
    name: "Nature Walk",
    icon: "leaf",
    requires_observation: true,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-7",
    category_id: "cat-7",
    name: "Water Play",
    icon: "droplet",
    requires_observation: false,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "act-8",
    category_id: "cat-8",
    name: "Painting",
    icon: "brush",
    requires_observation: true,
    created_at: "2023-01-01T10:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
];

// ========== DAILY AGENDA ITEMS ==========
export const mockAgendaItems: DailyAgendaItem[] = [
  {
    id: "agenda-1",
    activity_type_id: "act-1",
    group_id: "group-2",
    calendar_day_id: "cal-day-12",
    order_index: 1,
    title: "Healthy fruits and milk",
    created_at: "2023-10-11T10:00:00Z",
    updated_at: null,
  },
  {
    id: "agenda-2",
    activity_type_id: "act-2",
    group_id: null,
    calendar_day_id: "cal-day-12",
    order_index: 2,
    title: "Reading 'The Very Hungry Caterpillar'",
    created_at: "2023-10-11T10:00:00Z",
    updated_at: null,
  },
  {
    id: "agenda-3",
    activity_type_id: "act-3",
    group_id: "group-3",
    calendar_day_id: "cal-day-12",
    order_index: 3,
    title: "Free play in the garden sandbox",
    created_at: "2023-10-11T10:00:00Z",
    updated_at: null,
  },
];

// ========== DAILY ATTENDANCE ==========
export const mockAttendance: DailyAttendance[] = [
  {
    id: "att-rec-1",
    calendar_day_id: "cal-day-25",
    child_id: "child-1",
    attended: false,
    check_in: null,
    check_out: null,
    dropped_off_by: null,
    picked_up_by: null,
    observation: null,
    created_at: "2023-10-25T07:00:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "att-rec-2",
    calendar_day_id: "cal-day-25",
    child_id: "child-2",
    attended: true,
    check_in: "08:15",
    check_out: null,
    dropped_off_by: "user-3",
    picked_up_by: null,
    observation: null,
    created_at: "2023-10-25T08:15:00Z",
    updated_at: null,
    deleted_at: null,
  },
  {
    id: "att-rec-3",
    calendar_day_id: "cal-day-25",
    child_id: "child-3",
    attended: true,
    check_in: "08:30",
    check_out: null,
    dropped_off_by: "user-2",
    picked_up_by: null,
    observation: null,
    created_at: "2023-10-25T08:30:00Z",
    updated_at: null,
    deleted_at: null,
  },
];

// ========== INCIDENTS ==========
export const mockIncidents: Incident[] = [
  {
    id: "inc-12345",
    child_id: "child-6",
    reporter_id: "user-2",
    severity: "high",
    title: "Physical Altercation",
    description:
      "During recess at approximately 10:30 AM, a physical altercation occurred near the playground slide area. Teacher on duty, Mrs. Johnson, observed student Marcus engaging in aggressive behavior towards another student. The incident involved pushing and loud verbal confrontation.\n\nImmediate intervention was taken. Students were separated and escorted to the principal's office for de-escalation. No serious physical injuries were reported, though one student sustained a minor scrape on the knee.",
    action_taken:
      "Met with both students. Parents have been notified via phone call. Scheduled follow-up meeting for tomorrow morning.",
    parent_notified: true,
    parent_acknowledged_at: null,
    created_at: "2023-10-24T10:42:00Z",
    updated_at: null,
  },
  {
    id: "inc-12346",
    child_id: "child-1",
    reporter_id: "user-1",
    severity: "critical",
    title: "Allergic Reaction",
    description:
      "Mild peanut reaction in Toddler Group B. Child showed signs of allergic reaction after snack time. Epi-pen was not administered as symptoms were mild.",
    action_taken: "Parents contacted immediately. Child monitored closely.",
    parent_notified: true,
    parent_acknowledged_at: "2023-10-24T11:00:00Z",
    created_at: "2023-10-24T10:30:00Z",
    updated_at: null,
  },
  {
    id: "inc-12347",
    child_id: "child-5",
    reporter_id: "user-2",
    severity: "medium",
    title: "Playground Fall",
    description:
      "Child tripped on slide steps. Minor scrape on left knee. First aid applied.",
    action_taken: "Wound cleaned and bandaged. Ice pack applied.",
    parent_notified: true,
    parent_acknowledged_at: "2023-10-23T15:30:00Z",
    created_at: "2023-10-23T14:45:00Z",
    updated_at: null,
  },
  {
    id: "inc-12348",
    child_id: "child-4",
    reporter_id: "user-1",
    severity: "low",
    title: "Lost Item",
    description: "Blue winter jacket reported missing from Cubby #12.",
    action_taken: "Searched lost and found. Item not yet recovered.",
    parent_notified: true,
    parent_acknowledged_at: null,
    created_at: "2023-10-22T16:00:00Z",
    updated_at: null,
  },
];

// ========== POSTS (Lexical JSON format) ==========
export const mockPosts: Post[] = [
  {
    id: "post-1",
    author_id: "user-2",
    group_id: "group-2",
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "We had a great time painting today! ",
                type: "text",
                version: 1,
              },
              {
                detail: 0,
                format: 1,
                mode: "normal",
                style: "",
                text: "The kids really enjoyed mixing colors",
                type: "text",
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: " and making handprints. It was a messy but incredibly fun sensory activity for everyone involved. Check out these little artists!",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }),
    media_urls: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
      "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400",
    ],
    created_at: "2023-10-24T14:30:00Z",
    deleted_at: null,
  },
  {
    id: "post-2",
    author_id: "user-1",
    group_id: null,
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: "normal",
                style: "",
                text: "Holiday Closure Reminder",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Just a friendly reminder that the center will be closed next Monday, September 4th, for Labor Day. We will resume normal hours on Tuesday. Have a great long weekend!",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }),
    media_urls: null,
    created_at: "2023-10-24T09:00:00Z",
    deleted_at: null,
  },
  {
    id: "post-3",
    author_id: "user-3",
    group_id: "group-1",
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Does anyone have recommendations for durable sippy cups? The ones we bought last week are already leaking!",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }),
    media_urls: null,
    created_at: "2023-10-23T16:45:00Z",
    deleted_at: null,
  },
];

// ========== NOTIFICATIONS ==========
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    user_id: "user-1",
    title: "New Incident Report",
    message: "A new incident has been reported for Marcus Aurelius",
    read_at: null,
    created_at: "2023-10-24T10:45:00Z",
    updated_at: null,
  },
  {
    id: "notif-2",
    user_id: "user-1",
    title: "Parent Message",
    message: "Mike Parker sent you a message about Oliver's pickup",
    read_at: "2023-10-24T09:00:00Z",
    created_at: "2023-10-24T08:30:00Z",
    updated_at: null,
  },
  {
    id: "notif-3",
    user_id: "user-1",
    title: "Attendance Alert",
    message: "3 children have not checked in yet today",
    read_at: null,
    created_at: "2023-10-24T09:30:00Z",
    updated_at: null,
  },
];

// ========== ANALYTICS DATA ==========
export const analyticsData = {
  dailyAttendancePercent: 94.2,
  totalChildren: 142,
  capacityUtilization: 88,
  slotsAvailable: 18,
  activeIncidents: 2,
  attendanceTrend: [
    { date: "Oct 1", present: 125, absent: 17 },
    { date: "Oct 5", present: 130, absent: 12 },
    { date: "Oct 10", present: 128, absent: 14 },
    { date: "Oct 15", present: 135, absent: 7 },
    { date: "Oct 20", present: 138, absent: 4 },
    { date: "Oct 25", present: 132, absent: 10 },
    { date: "Oct 31", present: 140, absent: 2 },
  ],
  groupDistribution: [
    { group: "Infants (0-18m)", enrolled: 12, capacity: 16 },
    { group: "Toddlers (18m-3y)", enrolled: 28, capacity: 30 },
    { group: "Preschool (3y-5y)", enrolled: 45, capacity: 50 },
    { group: "After School", enrolled: 57, capacity: 64 },
  ],
};

// ========== UPCOMING EVENTS ==========
export const upcomingEvents = [
  {
    id: "event-1",
    date: "2023-09-04",
    title: "Labor Day - Closed",
    description: "All Day - Center Closed",
  },
  {
    id: "event-2",
    date: "2023-09-12",
    title: "Parent-Teacher Night",
    description: "6:00 PM - Main Hall",
  },
  {
    id: "event-3",
    date: "2023-09-20",
    title: "Fall Picture Day",
    description: "9:00 AM - Infants & Toddlers",
  },
];
