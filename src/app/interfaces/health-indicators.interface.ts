export interface HealthIndicators {
  data?: HealthIndicatorItem;
}

export interface HealthIndicatorItem {
  sums?: SumsItem;
}

export interface SumsItem {
  duration?: any;
  distance?: any;
  energy?: any;
  asleep?: any;
}
