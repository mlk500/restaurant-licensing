export interface BusinessInput {
  size: number;
  seats: number;
  usesGas: boolean;
  servesMeat: boolean;
}

export interface Regulation {
  id: number;
  category: string;
  hebrew_text: string;
  source_page: string;
  priority: string;
}

export interface CostEstimate {
  min: number;
  max: number;
  notes?: string;
}

export interface Requirement {
  id: number;
  title: string;
  original_text?: string;
  importance: 'קריטי' | 'חשוב' | 'רצוי';
  category: string;
  plain_explanation: string;
  practical_tips: string[];
  estimated_cost: CostEstimate;
  estimated_time_days: number;
  required_professionals?: string[];
}

export interface StructuredReport {
  summary: string;
  total_estimated_cost?: CostEstimate;
  total_estimated_days?: number;
  requirements: Requirement[];
  next_steps?: string[];
  important_notes?: string[];
  error?: boolean;
}

export interface ReportResponse {
  user_input: BusinessInput;
  total_regulations: number;
  relevant_regulations: number;
  report: string | StructuredReport;
  raw_regulations: Regulation[];
}