export interface KeyFactor {
  name: string;
  impact_percent: number;
  impact_label: string;
  direction: 'positive' | 'negative';
  category: 'venue' | 'form' | 'h2h' | 'availability' | 'tactical';
}

export interface HeadToHeadSummary {
  total_meetings: number;
  home_wins: number;
  away_wins: number;
  draws: number;
  home_win_ratio: number;
  last_5_results: string[];
}

export interface TeamFormSummary {
  team_name: string;
  last_5: string[];
  form_points: number;
  avg_score_recent: number;
}

export interface PredictedProbabilities {
  p_home: number;
  p_away: number;
  p_draw?: number | null;
  most_likely_outcome: string;
}

export interface ExpectedScoreSummary {
  home_expected: number;
  away_expected?: number | null;
  score_range_label: string;
  metric_type: 'runs' | 'goals';
}

export interface UpcomingMatchPredictionItem {
  id: string;
  sport: 'cricket' | 'football' | string;
  league: string;
  match_date: string;
  venue: string;
  team_home: string;
  team_away: string;
  team_home_logo: string;
  team_away_logo: string;
  probabilities: PredictedProbabilities;
  expected_score: ExpectedScoreSummary;
  confidence_level: string;
  data_sufficiency: 'sufficient' | 'insufficient_data';
  key_factors: KeyFactor[];
  h2h: HeadToHeadSummary;
  form_home: TeamFormSummary;
  form_away: TeamFormSummary;
  model_version: string;
}

export interface MatchPredictionRequest {
  sport: 'cricket' | 'football';
  team_home: string;
  team_away: string;
  venue?: string;
  toss_winner?: string;
  toss_decision?: 'bat' | 'field';
  player_availability_home?: number;
  player_availability_away?: number;
}

export interface MatchPredictionResponse {
  matchup: string;
  sport: string;
  data_sufficiency: 'sufficient' | 'insufficient_data';
  sufficiency_message?: string;
  probabilities: PredictedProbabilities;
  expected_score: ExpectedScoreSummary;
  confidence_level: string;
  key_factors: KeyFactor[];
  h2h?: HeadToHeadSummary | null;
  model_assumptions: string[];
  limitations_disclaimer: string;
}

export interface ModelMetricsSummary {
  model_type: string;
  log_loss: number;
  brier_score: number;
  accuracy_percent: number;
  expected_calibration_error?: number;
  score_mae_runs?: number;
}

export interface ModelEvaluationResponse {
  engine_version: string;
  pipeline_name: string;
  trained_at: string;
  framework: string;
  temporal_validation: string;
  probability_calibration: string;
  models: {
    cricket?: {
      sport: string;
      dataset: string;
      train_samples: number;
      test_samples: number;
      baseline_metrics: ModelMetricsSummary;
      calibrated_metrics: ModelMetricsSummary;
      log_loss_reduction_percent: number;
      brier_score_reduction_percent: number;
      calibration_curve: Array<{ mean_predicted: number; fraction_positive: number }>;
      feature_importance: Array<{ feature: string; weight: number }>;
    };
    football?: {
      sport: string;
      dataset: string;
      train_samples: number;
      test_samples: number;
      baseline_metrics: ModelMetricsSummary;
      calibrated_metrics: ModelMetricsSummary;
      log_loss_reduction_percent: number;
      brier_score_reduction_percent: number;
      feature_importance: Array<{ feature: string; weight: number }>;
    };
  };
  disclaimer: string;
}

export interface PredictionHistoryItem {
  id: string;
  date: string;
  sport: string;
  matchup: string;
  predicted_winner: string;
  predicted_probability: number;
  actual_winner?: string;
  actual_scoreline?: string;
  status: 'CORRECT' | 'INCORRECT' | 'PENDING';
  brier_error?: number;
}
