/**
 * VeriLaunch API Client
 * Centralized HTTP service layer — all backend calls go through here.
 * Auth token is injected automatically from localStorage.
 */

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('vl_token');
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('vl_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as Promise<T>;
}

// ─────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; role: string }>('POST', '/auth/login', { email, password }),

  register: (email: string, password: string, role: string) =>
    request<string>('POST', '/auth/register', { email, password, role }),
};

// ─────────────────────────────────────────
// Jobs API
// ─────────────────────────────────────────
export const jobsApi = {
  search: (keyword?: string, page = 0, size = 20) =>
    request<{ content: JobDto[]; totalElements: number }>('GET', `/v1/jobs/search?keyword=${keyword ?? ''}&page=${page}&size=${size}`),

  matchScore: (jobId: string, skills: string) =>
    request<{ matchScore: number; factors: Record<string, unknown> }>('GET', `/v1/jobs/${jobId}/match?skills=${encodeURIComponent(skills)}`),

  create: (payload: CreateJobPayload) =>
    request<JobDto>('POST', '/v1/jobs', payload),

  close: (jobId: string) =>
    request<JobDto>('PUT', `/v1/jobs/${jobId}/close`),
};

// ─────────────────────────────────────────
// Resume API
// ─────────────────────────────────────────
export const resumeApi = {
  build: (candidateId: string, profileData: string) =>
    request<ResumeVersionDto>('POST', '/v1/resumes/build', { candidateId, profileData }),

  tailor: (resumeVersionId: string, jobDescription: string) =>
    request<{ tailoredContent: string; changeSummary: string; riskFlags: string }>('POST', '/v1/resumes/tailor', { resumeVersionId, jobDescription }),
};

// ─────────────────────────────────────────
// Applications API
// ─────────────────────────────────────────
export const applicationsApi = {
  createDraft: (candidateId: string, jobId: string, resumeVersionId: string) =>
    request<ApplicationDto>('POST', '/v1/applications/draft', { candidateId, jobId, resumeVersionId }),

  queue: (applicationId: string) =>
    request<ApplicationDto>('PUT', `/v1/applications/${applicationId}/queue`),

  submit: (applicationId: string) =>
    request<ApplicationDto>('PUT', `/v1/applications/${applicationId}/submit`),

  forCandidate: (candidateId: string) =>
    request<ApplicationDto[]>('GET', `/v1/applications/candidate/${candidateId}`),
};

// ─────────────────────────────────────────
// Verification API
// ─────────────────────────────────────────
export const verificationApi = {
  initiate: (candidateId: string, verificationType: string) =>
    request<VerificationRecordDto>('POST', '/v1/verifications/initiate', { candidateId, verificationType }),

  forCandidate: (candidateId: string) =>
    request<VerificationRecordDto[]>('GET', `/v1/verifications/candidate/${candidateId}`),
};

// ─────────────────────────────────────────
// DTO Types
// ─────────────────────────────────────────
export interface JobDto {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  status: string;
  createdAt: string;
}

export interface CreateJobPayload {
  employerId: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType?: string;
}

export interface ResumeVersionDto {
  id: string;
  version: number;
  baseContent: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApplicationDto {
  id: string;
  status: string;
  idempotencyKey: string;
  submittedAt?: string;
  createdAt: string;
}

export interface VerificationRecordDto {
  id: string;
  verificationType: string;
  status: string;
  confidenceScore?: number;
  createdAt: string;
}
