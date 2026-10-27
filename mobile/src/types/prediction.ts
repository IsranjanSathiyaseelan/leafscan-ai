export interface ClassScore {
  class_name: string;
  score: number;
}

export interface PredictionResponse {
  predicted_class: string;
  score: number;
  top_predictions: ClassScore[];
  model_name: string;
  notice: string;
}