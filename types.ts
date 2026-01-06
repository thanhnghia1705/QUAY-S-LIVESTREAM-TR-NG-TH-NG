
export interface Pharmacy {
  area: string;
  code: string;
  name: string;
}

export interface Prize {
  id: number;
  label: string;
  giftName: string;
  quantity: number;
  remaining: number;
  imageUrl?: string;
  rank: number; // For sorting purposes (1 is highest, 5 is lowest)
}

export interface Winner {
  pharmacy: Pharmacy;
  prize: Prize;
  timestamp: string;
}

export type Step = 'intro' | 'setup' | 'prizes' | 'draw' | 'results';
