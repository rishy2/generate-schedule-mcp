export interface Time {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    startDate: string;
    endDate: string;
    startTime: number;
    endTime: number;
    building: string;
    campus: string;
    room: string;
}

export interface Teacher {
    id: number;
    email_id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    rating: number;
    school: string;
    numreviews: number;
}

export interface Course {
    id: number;
    crn: string;
    school: string;
    term: string;
    subject: string;
    coursenumber: string;
    maximumenrollment: number;
    enrollment: number;
    seatsavailable: number;
    waitcount: number;
    credithourlow: number;
    coursetitle: string;
    subjectdescription: string;
    meetingtimes: Time[];
    teachers: Teacher[];
    timesasnumber: number[]; // usually 6 slots
    avgRating: number;
}

export interface Schedule {
    avgRating: number;
    totalTime: number;
    totalDays: number;
    name: string;
    id: number;
    user_id: string;
    term: string;
    courses: Course[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
}

export interface ScheduleCourses {
    schedule_id: string;
    course_id: string;
}

export interface CourseEvent {
    crn: string;
    startTime: number;
    endTime: number;
    building: string;
    campus: string;
    room: string;
    subject: string;
    professor: string;
}

export interface Review {
    teacher_id: number;
    user_id: string;
    subject: string;
    coursenumber: string;
    review_text: string;
    rating: number;
    created_at: Time;
}

export interface SaveScheduleRequestBody {
    userId: string;
    scheduleName: string;
    schedule: Schedule;
}

export interface UserEvent {
    startTime: string;
    endTime: string;
    subject: string;
    days: string[];
}
